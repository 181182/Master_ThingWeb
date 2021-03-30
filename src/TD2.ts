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
        ).then((exposedThing)=>{
			this.thing = exposedThing;
			this.td = exposedThing.getThingDescription();
		    this.add_properties();
	//		this.add_actions();
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

    // private myPropertyHandler(){
	// 	return new Promise((resolve, reject) => {
	// 		// read something
	// 		resolve();
	// 	});
    // }

    // private myActionHandler(inputData){
	// 	return new Promise((resolve, reject) => {
	// 		// do something with inputData
	// 		resolve();
	// 	});	
    // }



    private add_properties() {
        //fill in add properties
        setInterval(() => {
			this.thing.writeProperty("AcousticTomopraphy", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("GeoPositioning", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("OceanGraphicPoint", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
    }

    // private add_actions() {
    //     //fill in add actions
    //     this.thing.setActionHandler("myAction",(inputData) => {            
    //      	return new Promise((resolve, reject) => {
	//             if (!ajv.validate(this.td.actions.myAction.input, inputData)) {
	//                 reject(new Error ("Invalid input"));
	//             }
	//             else {
	//                 resolve(this.myActionHandler(inputData));
	//             }
	//         });
    //     });
    // }
    private add_events() {
		// can/should be removed, no need to add events anywhere, just emit them
    }
}
