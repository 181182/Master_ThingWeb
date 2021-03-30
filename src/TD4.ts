import * as WoT from "wot-typescript-definitions"

var request = require('request');

//const Ajv = require('ajv');
//var ajv = new Ajv();

export class WotDevice {
    public thing: WoT.ExposedThing;
    public WoT: WoT.WoT;
    public td: any;

    constructor(WoT: WoT.WoT, tdDirectory?: string) {
        //create WotDevice as a server
        this.WoT = WoT;
        this.WoT.produce(
            //fill in the empty quotation marks
            {
				"@context": [
					"https://www.w3.org/2019/wot/td/v1",
					{ "@language": "en" }
				],
				id: "PD4:thing",
				title: "PD4",
				description: "Pilot Demonstrator 4",
				properties: {
					PipelineVibration: {
						type: "integer",
                        unit: "hertz",
						description: "current Pipeline Vibrations in Hertz",
						observable: false,
						readOnly: true
					},
					GUW: {
						type: "integer",
						description: "current GUW measurements",
						observable: false,
						readOnly: true
					}
				},
				events: {
					GasLeakage: {
						type: "boolean",
						description: "Warning from gas leakage"
					}
				}
			}
        ).then((exposedThing)=>{
			this.thing = exposedThing;
			this.td = exposedThing.getThingDescription();
		    this.add_properties();
			this.add_events();
			this.thing.expose();
			if (tdDirectory) { this.register(tdDirectory); }
        });
    }
    
    public register(directory: string) {
        console.log("Registering TD in directory: " + directory)
        request.post(directory, {json: this.thing.getThingDescription()}, (error, response, body) => {
            if (!error && response.statusCode < 300) {
                console.log("TD registered!");
            } else {
                console.debug(error);
                console.debug(response);
                console.warn("Failed to register TD. Will try again in 10 Seconds...");
                setTimeout(() => { this.register(directory) }, 10000);
                return;
            }
        });
    }
    private add_properties() {
        //fill in add properties
        setInterval(() => {
			this.thing.writeProperty("PipelineVibration", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("GUW", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
    }
    private add_events() {
		setInterval(() => {
			if (Math.floor(Math.random() * 101) > 50) {
				this.thing.emitEvent("GasLeakage", true);
			}
		}, 3000);
    }
}
