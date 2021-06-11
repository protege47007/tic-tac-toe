let socket;
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
let users = [], id;

let  nick;
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
        if (users.length > 1) {
            //input parameter is false indicating the game isn't offline
            startGame(false);

        } else {
            //since there won't be a second player no point in moving on in the game
            document.querySelector('.err').style.display = 'inline-block';
        }
    }
    else{
        //input parameter is true indicating the game is online
        startGame(true);
    }
});

//creating new html element using vanilla js instead of JQuery's '.append'.. was just curious ;) 
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

//this is the player profile maker that includes the user variable to handle the users name and socket.id..
const PlProfile = function (user, piece) {
    this.user = user;

    //this is the user's assigned piece which is automatically assigned at the start of the game
    //and it is changed after each win or draw
    this.piece = piece;
    let score = 0;

    //scores would be updated from here
    this.UpdateScore = function () {
        score++;
        let x = '.' + piece;
        document.querySelector(x).innerText = String(score);
    }

    //this handles the player piece change and also notifying the score board about the change in piece
    //since we are using the piece to change scores in the DOM
    this.pieceChange = function () {
        let y = piece.toLowerCase();
        $('#' + y).removeClass('.' + piece);
       piece = piece === 'X' ? 'O' : 'X';
       $('#' + y).addClass('.' + piece);
    }
    

    //this is to receiving the player's name for the score board or game status
    this.plName = function () {
        return user.name;
    }

    //this is for when it is a player's turn to play
    //and checks if the game is offline so the computer would generate a play
    this.plTurnPlay = function () {
        if (mode.value === offline) {
            genX();
        } else {
            let play = document.querySelectorAll('.board').forEach(e => e.addEventListener('click', sqClick));
            //emits the play of the a player to the server
            socket.emit('play', play);
            this.plName();    
        }
        
    }

    // this is a safe gaurd incase the other player wants to play 
    this.OtherPlTurn = function () {
        socket.on('receivingPlay', (data) => {
            data;
        });
    }
}

function startGame(gameMode) {

    document.querySelector('alert').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    
    player1 = new PlProfile(users[0], 'X');
    player2 = !gameMode ? new PlProfile('COM', 'O') : new PlProfile(users[1], 'O');
    
}

let player1, player2;

const genX = function()  {
    let rand = Math.floor(Math.random() * 10);
    const tile = document.querySelectorAll('.tile');
    let z;
    tile.forEach( (e, i) => {
        let y = e.getAttribute('data-index');
        rand === i ? z = e : null;
    });
    let x = sqClick(z);
    if(x == undefined){
          genX();
     }
     
}

socket.on('UpdateStatus', data);
socket.on('Reset-Game', data);



//switch player's piece after a game is drawn or won

//******single player logic******
//if the game is offline: player two would use a random number generator { x = Math.floor(Math.random() * 7);}
// when a tile is selected: it's index is pushed into an array 