"use strict";
class Client {
    constructor() {
        this.socket = io();
        this.socket.on("message", function (message) {
            console.log(message);
            document.body.innerHTML = message;
        });
    }
}
const client = new Client();
