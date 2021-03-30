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
					// GasLeakage: {
					//     type: "boolean",
					//     description: "current status on Gas Leakage",
					//     observable: false,
					//     readOnly: true
					// }
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
			this.thing.writeProperty("CO2", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("Temperature", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("pH", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("Gravity", Math.random().toString()); //replace quotes with the initial value
		}, 1000);
		setInterval(() => {
			this.thing.writeProperty("Salinity", Math.random().toString()); //replace quotes with the initial value
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
		setInterval(() => {
			if (Math.floor(Math.random() * 101) > 50) {
				this.thing.emitEvent("GasLeakage", true);
			}
		}, 3000);
    }
}
