import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"

const port: number = 3000

// interface User {
//     name: string
//     id: string
//     room: string
//     dice: number
// }

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server

    // private players: { [id: string]: User } = {}

    constructor(port: number) {
        this.port = port
        console.log('port:',this.port)
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))
        app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')))
        app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')))

        this.server = new http.Server(app)
        this.io = new socketIO.Server(this.server);
        

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)
            // this.players[socket.id] = {name:'non-player', id:socket.id, room:'non', dice: 0 }

            socket.on('joinroom',  (join_room_name) => {
                console.log(Array.from(socket.rooms))
                if(Array.from(socket.rooms)[1] != join_room_name){
                    // leave room porcessing
                    var leave_room_name:string = Array.from(socket.rooms)[1]
                    socket.leave(leave_room_name)
                    var leave_user = socket.id
                    // emit evrybody leave_user leave the room!!
                    socket.in(leave_room_name).emit('leaved_room', leave_user)

                    // join room porcessing
                    socket.join(join_room_name)
                    // console.log(socket.rooms.values())

                    // get room menber list
                    var room_map = this.io.sockets.adapter.rooms
                    console.log('room_map:',room_map)
                    console.log(Array.from(socket.rooms)[1])

                    var menber_list = Array.from(room_map.get(join_room_name))
                    var join_user = socket.id
                    // emit join!!!
                    socket.in(join_room_name).emit('joinroom',menber_list,join_user)
                    socket.emit('joinroom',menber_list)
                }   
            })
            
            socket.on('dicerool', (maxNum)=>{
                let dicerool:number = this.getRandomInt(maxNum)
                console.log('yes')
                socket.in(Array.from(socket.rooms)[1]).emit('dicerool',dicerool,socket.id)
                socket.emit('dicerool',dicerool)
            })

            socket.on('disconnect', (room) => {
                var disconnect_user:string = socket.id
                socket.in(room).emit('leaved_room', disconnect_user)
                console.log('room:',socket.rooms)
                console.log('socket disconnected : ' + socket.id)

            });

        })
    }
    public getRandomInt(max) {
        return Math.floor(Math.random() * max) + 1;
    }
    public Start() {
        this.server.listen(this.port)
        console.log( `Server listening on port ${this.port}.` )
    }

}

new App(port).Start()