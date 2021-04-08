class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        this.socket.on('joinedroom', (memlist:Array<string>)=>{
            console.log(memlist)
            var memberlist = document.getElementById('memberlist');
            memberlist.innerHTML = ''
            for(let member of memlist){
                var elem = document.createElement("li");
                elem.innerHTML = member 
                memberlist.appendChild(elem);
            }

        })
    }
    public joinRoom() {
        let roomName:any = $("#roomname").val();
        if (roomName.toString().length > 0) {

            this.socket.emit("joinroom",roomName)
            // alert('join')

            // let room_name:any = $("#room").val()
            // console.log(room_name)
        }
    }
}

const client = new Client();
