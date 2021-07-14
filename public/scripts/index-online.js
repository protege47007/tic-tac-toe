//socket.io initialisation
let socket = io('http://localhost:3030');

//this activates the connection function on the server side
socket.on('connection');


//player profile declaration
const PlayerProfile = function (name, piece){
    this.name = name;
    this.score = 0;
    this.piece = piece;

    this.won = () => {
        this.score++;
       this.piece === 'X' ?  this.piece = 'O' :  this.piece =  'X';
    }
}

//accessing players' name
let a = document.querySelector('.pl-one').textContent;
let b = document.querySelector('.pl-two').textContent;

//constants declaration
const turn = document.querySelector('.newStatus');

//players initialisations ***Updated**
playerOne = new PlayerProfile(a, 'X');
playerTwo = new PlayerProfile(b, 'O');

//variable declarations
let active = true;
let currentPl = playerOne;
let startPl = playerOne;
const changeStartPlayer = function (){
    startPl == playerOne ? startPl = playerTwo: startPl = playerOne;
}




let state = ["", "", "", "", "", "", "", "", ""];

//game status prompter
const win = () =>  `${currentPl} has won!`;

const draw = () => 'Game is a draw';

const plTurn = () =>  `its ${currentPl.name}'s turn`;

turn.innerHTML = plTurn(); 

//function to handle the tile that has been clicked
function sqPlayed(sqClicked, sqIndex) {
    state[sqIndex] = currentPl.piece;
    sqClicked.innerHTML = currentPl.piece;
}

const plTurnPlay = ()=>{
    
    document.querySelectorAll('.tile').forEach( e => e.innerHTML= "");
}

//function to handle player change after a play
function plChange(){
    currentPl === playerOne ? currentPl = playerTwo : currentPl = playerOne;
    currentPl.plTurnPlay();
    turn.textContent = plTurn();
}


//wining combinations declaration
const winingCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
];

//function to constantly check after a play to check if there's a wining combo
function resultCheck(){
    let won = false;

    //first we loop through the wining combos array (i.e. it is a nested array)
    for (let i = 0; i <= 7; i++) {

        //since each array in the wining combo has three (3) elements, we assign them to an identifier
        const winCombo = winingCombos[i];
        let a = state[winCombo[0]];
        let b = state[winCombo[1]];
        let c = state[winCombo[2]];

        //this checks to see if the array is empty
        if (a === '' || b === '' || c === '') {
            continue;
        }
        
        //this checks to see if there's a wining combo then breaks the loop
        if (a === b && b === c) {
            won = true;
            break;
        }
    }

    //in the event of a wining combo been spotted, a truthy value is recieved from above
    if (won){
        //the winner is announced
        turn.innerHTML = win();
        //the scoreboard is changed
        currentPl.UpdateScore();
        //this clears the board after a while for a fresh game
        setTimeout(() => {
            resetGame();
        }, 1000);
        active = false;
        changeStartPlayer();
        return;
    }

    //in the event of a draw, this annouces there's a draw and clears the board
    let gameDrawn = !state.includes("");
    if (gameDrawn) {
        turn.textContent = draw();
        setTimeout(() => {
            resetGame();
        }, 1000);
        active = false;
        changeStartPlayer();
        return;
    }

    //if we are here then no wining combo has been hit and a change of player's turn is done
    plChange();
}
//this is activated by the event listener on each tile on the board
function sqClick(e){
    const sqClicked = e.target;

    //this gets the index attribute of the tile clicked 
    const sqIndex = parseInt(sqClicked.getAttribute('data-index'));
 
    if (state[sqIndex] !== "" || !active){
        return;
    }

    sqPlayed(sqClicked, sqIndex);
    resultCheck();
}

//socket recieving other player's move
socket.on('play', (e) => {
    sqClick(e);
});

//this resets the board but not the scoreoard
function resetGame(){
    active = true;
    currentPl = startPl;
    state = ["", "", "", "", "", "", "", "", ""];
    turn.textContent = plTurn();
    document.querySelectorAll('.tile').forEach( e => e.innerHTML= "");
}

//this resets the board but not the scoreoard ***Updated**
function resetGame(){
    active = true;
    currentPl = playerOne;
    state = ["", "", "", "", "", "", "", "", ""];
    status.innerHTML = plTurn();
    document.querySelectorAll('.tile').forEach( e => e.innerHTML= "");
}

// this resets the board and the scoreboard
function resetBtn(){
    document.querySelector('.confirm').style.display = 'flex';
    
    document.querySelector('#yes').addEventListener('click', resetEntireGame);
    
    document.querySelector('#no').addEventListener('click', () => {
        document.querySelector('.confirm').style.display = 'none';
    });
}

function resetEntireGame(){
    resetGame();
    playerTwo.score = 0;
    playerOne.score = 0;
    updateScoreBoard();
}

//quering the elements we are targeting in the html 
let reset = document.querySelector('#reset').addEventListener('click', resetBtn);
socket.emit('reset', reset);




//no longer needed
//  = "X";
// let countX = 0;
// let countO = 0;

// console.log(socketFunc());

// let socket = socketFunc();


// console.log();


//former scoreboard updater
// const scoreBoardChange = () => {
//     if(currentPl === 'X' ){
//         let x = document.querySelector(".X");
//         let value = x.innerText;
//         // console.log(x.innerText);
//         x.innerText = String(Number(value) + 1);
//     }
//     else{
//         let o = document.querySelector(".O");
//         let value = o.innerText;
//         // console.log(x.innerText);
//         o.innerText = String(Number(value) + 1)
//     }
// }
 

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


//socket listener for users list update
socket.on('usersDb', (data) => {
    data.forEach( (e) => {
        users.push(e);
        document.querySelector('#users').appendChild(CreateElement(e));
    });
});

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
