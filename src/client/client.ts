interface Quux {
    quuz: string;
    corge: number;
}

class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        this.socket.on('joinroom', (menber_list:Array<string>,join_user:string)=>{
            // console.log(menber_list)
            var menber_list_elem = document.getElementById('menber_list_elem');
            // menber_list_elem.innerHTML = ''
            
            if (join_user){
                // another add join_user process
                var menbers = document.getElementsByClassName('menber')
                console.log('men:'+ menbers.length)
                var menber_line = document.createElement("li");
                menber_line.setAttribute('id',join_user)
                menber_line.setAttribute('class','menber')
                menber_line.innerHTML = join_user + '<span class="badge bg-secondary dice_result">00</span>'
                menber_list_elem.appendChild(menber_line)
            }else{
                // join user init process
                menber_list_elem.innerHTML = '' //init element
                for(let member of menber_list){
                    var menber_line = document.createElement("li");
                    menber_line.setAttribute('id',member)
                    menber_line.setAttribute('class','member_li')
                    menber_line.innerHTML = member + '<span class="badge bg-secondary dice_result">00</span>'
                    // menber_list_elem.appendChild(elem);
                    menber_list_elem.appendChild(menber_line)
                }
            }

        })

        this.socket.on('dicerool', (dicerool:string,socketID) => {
            if (socketID){
                var man = document.getElementById(socketID)
                man.getElementsByClassName('dice_result')[0].innerHTML = dicerool
            }else{
                var man = document.getElementById(this.socket.id)
                man.getElementsByClassName('dice_result')[0].innerHTML = dicerool
            // alert('yes')
                var dice = document.getElementById('result')
            // console.log(dice)
                dice.innerHTML = dicerool
            }
        })
        this.socket.on('leaved_room', (leave_user)=>{
            var leave_user_elem = document.getElementById(leave_user)
            if (leave_user_elem){
                leave_user_elem.remove()
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
    public diceRool() {
        let maxNum:number = 100
        if (maxNum.toString().length >0) {
            this.socket.emit('dicerool',maxNum)
        }
    }
}

const client = new Client();
