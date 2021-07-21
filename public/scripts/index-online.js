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

    this.play = ()=>{
        document.querySelectorAll('.tile').forEach( e => e.addEventListener('click', () => {
            sqClick;
            socket.emit('ClickedTile', e);
        }));
        return;
    }

    this.blockPlay = () => {
        document.querySelectorAll('.tile').forEach( e => e.removeEventListener('click', sqClick));
    }
}

//accessing players' name
let a = document.querySelector('.pl-one').textContent;
let b = document.querySelector('.pl-two').textContent;

//constants declaration
const status = document.querySelector('.newStatus');

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

status.textContent = plTurn(); 

//function to handle the tile that has been clicked
function sqPlayed(sqClicked, sqIndex) {
    state[sqIndex] = currentPl.piece;
    sqClicked.innerHTML = currentPl.piece;
}

//function to handle player change and tile event listener after a play
function plChange(){
    if (currentPl === playerOne) {
        currentPl.blockPlay();
        currentPl = playerTwo;
        currentPl.play();
    } else {
        currentPl.blockPlay();
        currentPl = playerOne;
        currentPl.play();
    }

    currentPl.plTurnPlay();
    status.textContent = plTurn();
}

//socket recieving other player's move
socket.on('play', (e) => {
    sqClick(e);
});

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
        status.innerHTML = win();

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
        status.textContent = draw();
        setTimeout(() => {
            resetGame();
        }, 1000);
        active = false;
        changeStartPlayer();
        return;
    }

    //if we are here, then, no wining combo has been hit and a change of player's turn is done
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



//this resets the board after a win or draw
function resetGame(){
    active = true;
    currentPl = startPl;
    state = ["", "", "", "", "", "", "", "", ""];
    status.textContent = plTurn();
    document.querySelectorAll('.tile').forEach( e => e.innerHTML= "");
}

//this resets the board but not the scoreoard ***Updated**
function resetGame(){
    active = true;
    currentPl = startPl;
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

socket.on('usersDb', (data) => {
    data.forEach( (e) => {
        users.push(e);
        document.querySelector('#users').appendChild(CreateElement(e));
    });
});


