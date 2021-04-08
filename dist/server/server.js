"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        app.use('/jquery', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/jquery/dist')));
        app.use('/bootstrap', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/bootstrap/dist')));
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.default.Server(this.server);
        this.io.on('connection', (socket) => {
            console.log('a user connected : ' + socket.id);
            socket.on('joinroom', (toRoom) => {
                console.log(Array.from(socket.rooms));
                if (socket.rooms.size > 1) {
                    console.log(socket.id + ' joined room');
                    let all_rooms = Array.from(socket.rooms);
                    all_rooms.shift();
                    for (let room of all_rooms) {
                        socket.leave(room);
                        console.log(this.io.sockets.adapter.rooms.get(room));
                        console.log(all_rooms);
                        if (this.io.sockets.adapter.rooms.get(room) != undefined) {
                            socket.in(room).emit('joinedroom', Array.from(this.io.sockets.adapter.rooms.get(room)));
                        }
                    }
                }
                // socket.leave('*')
                socket.join(toRoom);
                // console.log(socket.rooms.values())
                let roomMap = this.io.sockets.adapter.rooms;
                // console.log(roomMap)
                console.log(roomMap);
                let memlist = Array.from(roomMap.get(toRoom));
                socket.in(toRoom).emit('joinedroom', memlist);
                socket.emit('joinedroom', memlist);
            });
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });
        });
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map