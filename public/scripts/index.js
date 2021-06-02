
let connectToServer = () => {
    //socket.io initialisation
    const socket = io('http://localhost:3030');

    //this activates the connection function on the server side
    socket.on('connection');

    //this receives the message emitted by other sockets
    socket.on('connect', (data) => {
        document.querySelector('h1').innerHTML = data;
    });

    //end of socket.io 
}


let nom = document.querySelector('#hostName');
let mode = document.querySelector('input[name="mode"]:checked');
let data = document.querySelector('#form');
let nick;
data.submit( (e) => {
    e.preventDefault();
    nick = nom.value;

    if(mode.value === "online") connectToServer();
});



let player = function(piece, nickname) {
    this.piece = piece;
    this.nickname = nickname;

    this.playerPiece = () => {
        return this.piece
    }

    this.plName = () => {
        return this.nickname
    }
}
//this sends a message from the frontend to the backend
const sendMessage = () => {
    
    socket.emit('hostInit', nick);
}