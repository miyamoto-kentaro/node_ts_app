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
// interface User {
//     name: string
//     id: string
//     room: string
//     dice: number
// }
class App {
    // private players: { [id: string]: User } = {}
    constructor(port) {
        this.port = port;
        console.log('port:', this.port);
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        app.use('/jquery', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/jquery/dist')));
        app.use('/bootstrap', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/bootstrap/dist')));
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.default.Server(this.server);
        this.io.on('connection', (socket) => {
            console.log('a user connected : ' + socket.id);
            // this.players[socket.id] = {name:'non-player', id:socket.id, room:'non', dice: 0 }
            socket.on('joinroom', (join_room_name) => {
                console.log(Array.from(socket.rooms));
                if (Array.from(socket.rooms)[1] != join_room_name) {
                    // leave room porcessing
                    var leave_room_name = Array.from(socket.rooms)[1];
                    socket.leave(leave_room_name);
                    var leave_user = socket.id;
                    // emit evrybody leave_user leave the room!!
                    socket.in(leave_room_name).emit('leaved_room', leave_user);
                    // join room porcessing
                    socket.join(join_room_name);
                    // console.log(socket.rooms.values())
                    // get room menber list
                    var room_map = this.io.sockets.adapter.rooms;
                    console.log('room_map:', room_map);
                    console.log(Array.from(socket.rooms)[1]);
                    var menber_list = Array.from(room_map.get(join_room_name));
                    var join_user = socket.id;
                    // emit join!!!
                    socket.in(join_room_name).emit('joinroom', menber_list, join_user);
                    socket.emit('joinroom', menber_list);
                }
            });
            socket.on('dicerool', (maxNum) => {
                let dicerool = this.getRandomInt(maxNum);
                console.log('yes');
                socket.in(Array.from(socket.rooms)[1]).emit('dicerool', dicerool, socket.id);
                socket.emit('dicerool', dicerool);
            });
            socket.on('disconnect', (room) => {
                var disconnect_user = socket.id;
                socket.in(room).emit('leaved_room', disconnect_user);
                console.log('room:', socket.rooms);
                console.log('socket disconnected : ' + socket.id);
            });
        });
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max) + 1;
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map