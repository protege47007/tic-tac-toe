//player profile declaration
const PlayerProfile = function (name, piece){
    this.name = name;
    this.score = 0;
    this.piece = piece;

    this.won = () => {
        this.score++;
    }
}
//getAttribute('data-index')to check if the text value is '', if true: pass X||O else GenX()
// check player's turn to play logic



//Computer play's generator using random number generator
const genX = function()  {
    let rand = Math.floor(Math.random() * 10);

    if (state[rand] !== '' || !active) {
        genX();
    } else {
        let y = document.querySelectorAll('.tile');
        y.forEach( (e, i) => {
            if( i == rand ){
                sqPlayed(e, i);
                resultCheck();
            }
        });
    }
     
}


//constants declaration
const plNom = document.querySelector('.pl-one').textContent;
let playerOne = new PlayerProfile(plNom, 'X');
let playerTwo = new PlayerProfile('COM', 'O');

const status = document.querySelector('.newStatus');

//variable declarations
let active = true;
document.querySelector('.pl-two').textContent = playerTwo.name;
let currentPl = playerOne; 
let startPl = playerOne;
const changeStartPlayer = function (){
    startPl == playerOne ? startPl = playerTwo: startPl = playerOne;
    
}

let state = ["", "", "", "", "", "", "", "", ""];

//game status prompter
const win = () =>  `${currentPl.name}  has just won!`;

const draw = () => 'Game has ended in a draw';

let plTurn = () => `its ${currentPl.name}'s turn`;
status.innerHTML = plTurn();
 
playerOne.play = function(){
    document.querySelectorAll('.tile').forEach( e => e.addEventListener('click', sqClick));
    return;
}
playerOne.noPlay = function () {
    document.querySelectorAll('.tile').forEach( e => e.removeEventListener('click', sqClick));
    return;
}
playerOne.play();

const updateScoreBoard = () => {
    document.querySelector('#pl1-score').textContent = String(playerOne.score);
    document.querySelector('#pl2-score').textContent = String(playerTwo.score);
    if (playerOne.piece === 'X') {
        playerTwo.piece = 'X'; playerOne.piece = 'O'
    } else {
        playerOne.piece = 'X'; playerTwo.piece = 'O'
    }
    
}

//function to handle the tile that has been clicked
function sqPlayed(sqClicked, sqIndex) {
    state[sqIndex] = currentPl.piece;
    sqClicked.innerHTML = currentPl.piece;
}


//function to handle player change after a play
function plChange(){
    if (currentPl === playerOne) {
        currentPl.noPlay();
        currentPl = playerTwo;
        setTimeout(() => {
            genX();
        }, 1000);
    } else {
        currentPl = playerOne;
        currentPl.play();
    }
    status.textContent = plTurn();
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
        status.innerHTML = win();
        //the scoreboard is changed
        currentPl.won();
        updateScoreBoard();
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
        status.innerHTML = draw();
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

//this resets the board but not the scoreoard
function resetGame(){
    active = true;
    currentPl = startPl;
    state = ["", "", "", "", "", "", "", "", ""];
    status.innerHTML = plTurn();
    document.querySelectorAll('.tile').forEach( e => e.innerHTML= "");
    startPl == playerTwo ? genX() : playerOne.play();
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
    document.querySelector('.confirm').style.display = 'none';
    playerTwo.score = 0;
    playerOne.score = 0;
    updateScoreBoard();
}


//quering the elements we are targeting in the html 
document.querySelector('#reset').addEventListener('click', resetBtn);
document.querySelector('.players').style.display = 'none';