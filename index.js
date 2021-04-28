//Implementation of the Thing 
TD1 = require("./dist/TD1.js").WotDevice
TD2 = require("./dist/TD2.js").WotDevice
TD3 = require("./dist/TD3.js").WotDevice
TD4 = require("./dist/TD4.js").WotDevice



/*
This project supports the registration of the generated TD to a TD directory
Fill in the directory URI where the HTTP POST request to send the TD will be made
If you leave it empty, registration thread will never execute, otherwise it will try to register every 10 seconds 
*/
const TD_DIRECTORY = ""


Servient = require("@node-wot/core").Servient
//Importing of the bindings
HttpServer = require("@node-wot/binding-http").HttpServer
WebsocketServer = require("@node-wot/binding-websockets").WebSocketServer

//Creating the instances of the binding servers
var httpServer = new HttpServer({port: 8080});
var websocketServer = new WebsocketServer({port: 8081});


//Building the servient object
var servient = new Servient();
//Adding the different bindings to the server
servient.addServer(httpServer);
servient.addServer(websocketServer);

//Starting the servients
servient.start().then((WoT) => {
    td1 = new TD1(WoT, TD_DIRECTORY); 
    td2 = new TD2(WoT, TD_DIRECTORY);
    td3 = new TD3(WoT, TD_DIRECTORY);
    td4 = new TD4(WoT, TD_DIRECTORY);
});
