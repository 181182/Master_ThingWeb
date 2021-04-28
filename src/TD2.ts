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
				id: "PD2:thing",
				title: "PD2",
				description: "Pilot Demonstrator 2",
				properties: {
					AcousticTomopraphy: {
						type: "integer",
						unit: "hertz",
						description: "current Acoustic Tomography in Hertz",
						observable: false,
						readOnly: true
					},
					AcousticEnvironment: {
						type: "integer",
						unit: "hertz",
						description: "current Acoustic Environment in Hertz",
						observable: false,
						readOnly: true
					},
					GeoPositioning: {
						type: "integer",
						unit: "coordinates",
						description: "current Geo-Positioning in coordinates",
						observable: false,
						readOnly: true
					},
					OceanGraphicPoint: {
						type: "integer",
						unit: "coordinates",
						description: "current Acoustic Environment in Hertz",
						observable: false,
						readOnly: true
					}
				}
			}
		).then((exposedThing) => {
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
			this.thing.writeProperty("AcousticTomopraphy", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("AcousticEnvironment", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("GeoPositioning", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("OceanGraphicPoint", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
    }
    private add_events() {
		//Placeholder for Events
    }
}
