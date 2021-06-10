const socket;
let connectToServer = () => {
    //socket.io initialisation
    socket = io('http://localhost:3030');

    //this activates the connection function on the server side
    socket.on('connection');
}


//end of socket.io 

//initialising dom selectors
let nom = document.querySelector('#name');
let mode = document.querySelector('input[name="mode"]:checked');
let form = document.querySelector('#form');
let nomErr = document.querySelector('#nomErr');

//initialising user variables
let users = [], id, single;

const  nick;
form.submit( (e) => {
    e.preventDefault();
    nick = nom.value;

    if(mode.value === "online"){
        connectToServer();
        
        //player profile validation
        if (users.indexOf(nick)) {
            nomErr.style.display = 'inline-block';
            return;
        } else {
            //emitting the name to the server
            socket.emit('nomId', nick);
        }

        //initialising the game
        if (users.lenght > 1) {
            document.querySelector('.alert').style.display = 'none';
            document.querySelector('.game').style.display = 'block';

        } else {
            document.querySelector('.err').style.display = 'inline-block';
        }
    }
    else{
        single = true;
        document.getElementsByClassName('alert').style.display = 'none';
        document.querySelector('.game').style.display = 'block';
    }
});

//creating new html element using vanilla js instead of JQuery's '.append'
function CreateElement(content){
    let  p = document.createElement;
    p.style.color = 'light-green';
    p.textcontent = content;
    return p;
}


//socket listener for users list update
socket.on('usersDb', (data) => {
    data.forEach( (e) => {
        users.push(e);
        document.querySelector('#users').appendChild(CreateElement(e));
    });
});


const PlProfile = function (user, piece) {
    this.user = user;
    this.piece = piece;
    let score = 0;

    this.Updatescore = function () {
        score++;
        let x = '.' + piece;
        document.querySelector(x).innerText = String(score);
    }

    this.pieceChange = function () {
        let y = piece.toLowerCase();
        $('#' + y).removeClass('.' + piece);
       piece = piece === 'X' ? 'O' : 'X';
       $('#' + y).addClass('.' + piece);
    } 
}


//switch player's piece after a game is drawn or won

//******single player logic******
//if the game is offline: player two would use a random number generator { x = Math.floor(Math.random() * 7);}
// when a tile is selected: it's index is pushed into an array 

// const genX = function()  {
//     rand = Math.floor(Math.random() * 7);
// }
// let rand;

// if(arr.indexOf(rand)){
//     genX();
// }
// else{
//     const tile = document.querySelectorAll('.tile');
//     let z;

//     tile.forEach( (e) => {
//         let y = e.getAttribute('data-index');
//         rand === Number(y) ? z = e : null;
//     });
//     sqPlayed(z, rand);
//     resultCheck();
// }