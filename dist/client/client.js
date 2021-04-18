class Client {
    constructor() {
        this.socket = io();
        this.socket.on('joinroom', (menber_list, join_user) => {
            // console.log(menber_list)
            var menber_list_elem = document.getElementById('menber_list_elem');
            // menber_list_elem.innerHTML = ''
            if (join_user) {
                // another add join_user process
                var menbers = document.getElementsByClassName('menber');
                console.log('men:' + menbers.length);
                var menber_line = document.createElement("li");
                menber_line.setAttribute('id', join_user.id);
                menber_line.setAttribute('class', 'list-group-item');
                menber_line.innerHTML = '<div class="row"><div class="col-8">' + join_user.name + '</div><div class="col-4"><span class="page-link dice_result">00</span></div></div>';
                menber_list_elem.appendChild(menber_line);
            }
            else {
                // join user init process
                menber_list_elem.innerHTML = ''; //init element
                for (let menber of menber_list) {
                    var menber_line = document.createElement("li");
                    menber_line.setAttribute('id', menber.id);
                    menber_line.setAttribute('class', 'list-group-item');
                    console.log(menber);
                    menber_line.innerHTML = '<div class="row"><div class="col-8">' + menber.name + '</div><div class="col-4"><span class="page-link dice_result">00</span></div></div>';
                    // menber_list_elem.appendChild(elem)
                    menber_list_elem.appendChild(menber_line);
                }
            }
        });
        this.socket.on('dicerool', (player) => {
            if (player.id) {
                var man = document.getElementById(player.id);
                man.getElementsByClassName('dice_result')[0].innerHTML = player.dice[0];
            }
            else {
                var man = document.getElementById(this.socket.id);
                man.getElementsByClassName('dice_result')[0].innerHTML = player.dice[0];
                // alert('yes')
                var dice = document.getElementById('result');
                // console.log(dice)
                dice.innerHTML = player.dice[0];
            }
        });
        this.socket.on('leaved_room', (leave_user) => {
            var leave_user_elem = document.getElementById(leave_user.id);
            if (leave_user_elem) {
                leave_user_elem.remove();
            }
        });
        this.socket.on('leave_room', () => {
            this.showPanel(0);
        });
    }
    joinRoom() {
        let roomName = $("#join_room_name").val();
        var userName = $("#join_user_name").val();
        if (roomName.toString().length > 0) {
            this.socket.emit("joinroom", roomName, userName);
            // alert('join')
            // let room_name:any = $("#room").val()
            // console.log(room_name)
            this.showPanel(1);
        }
    }
    leaveRoom() {
        this.socket.emit('leaved_room');
    }
    diceRool() {
        let maxNum = 100;
        if (maxNum.toString().length > 0) {
            this.socket.emit('dicerool', maxNum);
        }
    }
    showPanel(id) {
        switch (id) {
            case 0:
                $("#roomPanel").fadeOut(100);
                $("#homePanel").delay(100).fadeIn(100);
                break;
            case 1:
                $("#homePanel").fadeOut(100);
                $("#roomPanel").delay(100).fadeIn(100);
                break;
        }
    }
}
const client = new Client();
