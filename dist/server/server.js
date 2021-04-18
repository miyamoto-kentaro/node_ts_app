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
        this.players = {};
        this.port = port;
        console.log('port:', this.port);
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        app.use('/jquery', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/jquery/dist')));
        app.use('/bootstrap', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/bootstrap/dist')));
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.default.Server(this.server);
        this.io.on('connection', (socket) => {
            // console.log('a user connected : ' + socket.id)
            this.players[socket.id] = { name: 'non-player', id: socket.id, room: '', dice: [0] };
            // console.log(this.players[socket.id])
            socket.on('joinroom', (join_room_name, join_user_name) => {
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
                    this.players[socket.id].room = join_room_name;
                    if (join_user_name)
                        this.players[socket.id].name = join_user_name;
                    // console.log(this.players[socket.id])
                    // console.log(socket.rooms.values())
                    // get room menber list
                    var room_map = this.io.sockets.adapter.rooms;
                    // console.log('room_map:',room_map)
                    // console.log(Array.from(socket.rooms)[1])
                    var menber_id_list = Array.from(room_map.get(join_room_name));
                    var menber_name_list = [];
                    for (let id of menber_id_list) {
                        menber_name_list.push(this.players[id]);
                    }
                    var join_user = this.players[socket.id];
                    // emit join!!!
                    socket.in(join_room_name).emit('joinroom', menber_name_list, join_user);
                    socket.emit('joinroom', menber_name_list);
                }
            });
            socket.on('leaved_room', () => {
                console.log('leave:', this.players[socket.id]);
                socket.in(this.players[socket.id].room).emit('leaved_room', this.players[socket.id]);
                socket.emit('leave_room');
                socket.leave(this.players[socket.id].room);
                this.players[socket.id].room = '';
                // console.log(this.players)
            });
            socket.on('dicerool', (maxNum) => {
                let dicerool = this.getRandomInt(maxNum);
                this.players[socket.id].dice.unshift(dicerool);
                console.log('yes');
                socket.in(Array.from(socket.rooms)[1]).emit('dicerool', this.players[socket.id]);
                socket.emit('dicerool', this.players[socket.id]);
            });
            socket.on('disconnect', () => {
                socket.in(this.players[socket.id].room).emit('leaved_room', this.players[socket.id]);
                delete this.players[socket.id];
                console.log(this.players);
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