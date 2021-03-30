//Where your concrete implementation is included
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
//Importing the required bindings
HttpServer = require("@node-wot/binding-http").HttpServer
//CoapServer = require("@node-wot/binding-coap").CoapServer
//MqttBrokerServer = require("@node-wot/binding-mqtt").MqttBrokerServer
WebsocketServer = require("@node-wot/binding-websockets").WebSocketServer

//Creating the instances of the binding servers
var httpServer = new HttpServer({port: 8080});
var websocketServer = new WebsocketServer({port: 8081});
//var coapServer = new CoapServer({port: 5683});
//var mqttserver = new MqttBrokerServer("test.mosquitto.org"); //change it according to the broker address


//Building the servient object
var servient = new Servient();
//Adding different bindings to the server
servient.addServer(httpServer);
servient.addServer(websocketServer);
//servient.addServer(mqttServer);

servient.start().then((WoT) => {
    td1 = new TD1(WoT, TD_DIRECTORY); // you can change the wotDevice to something that makes more sense
    td2 = new TD2(WoT, TD_DIRECTORY);
    td3 = new TD3(WoT, TD_DIRECTORY);
    td4 = new TD4(WoT, TD_DIRECTORY);
});
