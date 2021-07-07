//player profile declaration
const PlayerProfile = function (name, piece){
    this.name = name;
    this.score = 0;
    this.piece = piece;

    this.won = () => {
        this.score++;
        this.piece = this.piece === 'X' ? 'O' : 'X';
    }
}


//socket.io initialisation
let socket = io('http://localhost:3030');

//this activates the connection function on the server side
socket.on('connection');

 

// //initialising dom selectors..
// let nom = document.querySelector('#name');
// let radiobtns = document.querySelectorAll("input[name='mode']");
// let mode;
// radiobtns.forEach((radiobtn) => { 
//     radiobtn.addEventListener('change', (e) => {
//         mode = e.currentTarget.value;
//     })
// })
// let form = document.querySelector('#form');
// let nomErr = document.querySelector('#nomErr');

// //initialising user variables
// let users = [], id;

// let  nick;
// $('#form').submit( (e) => {
//     e.preventDefault();
//     nick = $('#name').val();

//     if(mode == "online"){
        
//         //player profile validation
//         if (users.indexOf(nick) != -1) {
//             nomErr.style.display = 'inline-block';
//             return;
//         } else {
//             //emitting the name to the server
//             socket.emit('nomId', nick);
//         }

//         //initialising the game
//         if (users.length <= 1) {
//             //input parameter is false indicating the game isn't offline
//             startGame(false);

//         } else {
//             //since there won't be a second player no point in moving on in the game
//             document.querySelector('.err').style.display = 'inline-block';
//             if (users.length > 1) {
//                 startGame(false);
//             }
//         }
//     }
//     else{
//         //input parameter is true indicating the game is online
//         startGame(true);
//     }
// });

// //creating new html element using vanilla js instead of JQuery's '.append'.. was just curious ;) 
// function CreateElement(content){
//     let  p = document.createElement;
//     p.style.color = 'light-green';
//     p.textcontent = content;
//     return p;
// }


// //socket listener for users list update
// socket.on('usersDb', (data) => {
//     data.forEach( (e) => {
//         users.push(e);
//         document.querySelector('#users').appendChild(CreateElement(e));
//     });
// });

// //this is the player profile maker that includes the user variable to handle the users name and socket.id..
// const PlProfile = function (user, piece) {
//     this.user = user;

//     //this is the user's assigned piece which is automatically assigned at the start of the game
//     //and it is changed after each win or draw
//     this.piece = piece;
//     let score = 0;

//     //scores would be updated from here
//     this.UpdateScore = function () {
//         score++;
//         let x = '.' + piece;
//         document.querySelector(x).innerText = String(score);
//     }

//     //this handles the player piece change and also notifying the score board about the change in piece
//     //since we are using the piece to change scores in the DOM
//     this.pieceChange = function () {
//         //converts the class name to a string
//         let y = piece.toLowerCase();

//         //removes the class from the player score tag
//         $('#' + y).removeClass('.' + piece);

//         //piece change after a win or a draw
//         piece = piece === 'X' ? 'O' : 'X';

//         // due to the change in piece we need to assign the new piece their score tags
//         $('#' + y).addClass('.' + piece);
//     }
    

//     //this is to receiving the player's name for the score board or game status
//     this.plName = function () {
//         return user.name;
//     }

//     //this is for when it is a player's turn to play
//     //and checks if the game is offline so the computer would generate a play
//     this.plOfflineTurnPlay = function () {
//             genX();    
//     }

//     //online player turn
//     this.plOnlineTurnPlay = function() {
//         let play = document.querySelectorAll('.board').forEach(e => e.addEventListener('click', sqClick));
//             //emits the play of the a player to the server
//             socket.emit('play', play);
//     }

//     // this is a safe gaurd incase the other player wants to play 
//     this.OtherPlTurn = function () {
//         socket.on('receivingPlay', (data) => {
//             data;
//         });
//     }
// }

// function startGame(gameMode) {

//     document.querySelector('.alert').style.display = 'none';
//     document.querySelector('.game').style.display = 'flex';
    
//     player1 = new PlProfile(users[0], 'X');
//     player2 = !gameMode ? new PlProfile('COM', 'O') : new PlProfile(users[1], 'O');
    
// }

// let player1, player2;



// socket.on('Reset-Game', (data)=>{
//     data;
// });



// //switch player's piece after a game is drawn or won

// //******single player logic******
// //if the game is offline: player two would use a random number generator { x = Math.floor(Math.random() * 7);}
// // when a tile is selected: it's index is pushed into an array 
