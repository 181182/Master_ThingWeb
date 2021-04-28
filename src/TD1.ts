import * as WoT from "wot-typescript-definitions"

var request = require('request');


export class WotDevice {
    public thing: WoT.ExposedThing;
    public WoT: WoT.WoT;
    public td: any;

    constructor(WoT: WoT.WoT, tdDirectory?: string) {
        //create WotDevice as a server
        this.WoT = WoT;
		//Handmade thing descriptor
        this.WoT.produce(
            {
				"@context": [
					"https://www.w3.org/2019/wot/td/v1",
					{ "@language": "en" }
				],
				id: "PD1:thing",
				title: "PD1",
				description: "Pilot Demonstrator 1",
				properties: {
					CO2: {
						type: "integer",
						description: "current CO2 value",
						observable: false,
						readOnly: true
					},
					Temperature: {
						type: "integer",
						description: "current Temperature value in Celcius",
						observable: false,
						readOnly: true
					},
					pH: {
						type: "integer",
						description: "current pH value",
						observable: false,
						readOnly: true
					},
					Gravity: {
						type: "integer",
						description: "current G force value in m/s^2",
						observable: false,
						readOnly: true
					},
					Salinity: {
						type: "integer",
						description: "current Salinity value in parts per thousand",
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
    
	//Registering Thing Descriptor for the servient
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
        //Random values generated to the properties to emit
        setInterval(() => {
			this.thing.writeProperty("CO2", Math.random().toString()); 
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("Temperature", Math.random().toString());
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("pH", Math.random().toString()); 
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("Gravity", Math.random().toString());
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("Salinity", Math.random().toString());
		}, 1000);
    }
    private add_events() {
		//Interval set for when the event will emit
		setInterval(() => {
			if (Math.floor(Math.random() * 101) > 50) {
				this.thing.emitEvent("GasLeakage", true);
			}
		}, 3000);
    }
}
