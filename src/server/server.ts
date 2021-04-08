import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))
        app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')))
        app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')))

        this.server = new http.Server(app)
        this.io = new socketIO.Server(this.server);


        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)

            socket.on('joinroom',  (toRoom) => {
                console.log(Array.from(socket.rooms))
                if(socket.rooms.size > 1){
                    console.log(socket.id + ' joined room')
                    let all_rooms: Array<string> = Array.from(socket.rooms)
                    all_rooms.shift()
                    for(let room of all_rooms){
                        socket.leave(room)
                        console.log(this.io.sockets.adapter.rooms.get(room))
                        console.log(all_rooms)
                        if(this.io.sockets.adapter.rooms.get(room) != undefined){
                            socket.in(room).emit('joinedroom',Array.from(this.io.sockets.adapter.rooms.get(room)))
                        }
                    }
                }
                // socket.leave('*')
                socket.join(toRoom)
                // console.log(socket.rooms.values())
                let roomMap = this.io.sockets.adapter.rooms
                // console.log(roomMap)
                console.log(roomMap)
                
                let memlist = Array.from(roomMap.get(toRoom))
                socket.in(toRoom).emit('joinedroom',memlist)
                socket.emit('joinedroom',memlist)

            })

            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id)

            });

        })
    }

    public Start() {
        this.server.listen(this.port)
        console.log( `Server listening on port ${this.port}.` )
    }
}

new App(port).Start()