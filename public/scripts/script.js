//constants declaration


const turn = document.querySelector('.newStatus');


//variable declarations
let active = true;
let currentPl;

//no longer needed
//  = "X";
// let countX = 0;
// let countO = 0;

// console.log(socketFunc());

// let socket = socketFunc();


// console.log();


let state = ["", "", "", "", "", "", "", "", ""];

//game status prompter
const win = () =>  currentPl + ' has won!';

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

const draw = () => 'Game is a draw';

const plTurn = () =>  currentPl + "'s turn";




turn.innerHTML = plTurn(); 

//function to handle the tile that has been clicked
function sqPlayed(sqClicked, sqIndex) {
    state[sqIndex] = currentPl;
    sqClicked.innerHTML = currentPl;
}


//function to handle player change after a play
function plChange(){
    currentPl = currentPl === player1 ? player2 : player1;
    currentPl.plTurnPlay();
    turn.innerHTML = plTurn();
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
        return;
    }

    //in the event of a draw, this annouces there's a draw and clears the board
    let gameDrawn = !state.includes("");
    if (gameDrawn) {
        turn.innerHTML = draw();
        setTimeout(() => {
            resetGame();
        }, 1000);
        active = false;
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
    currentPl = "X";
    state = ["", "", "", "", "", "", "", "", ""];
    turn.innerHTML = plTurn();
    document.querySelectorAll('.tile').forEach( e => e.innerHTML= "");
}

// this resets the board and the scoreboard
function resetBtn(){
   mode == 'online' ? prompt() : resetEntireGame();
}

function resetEntireGame(){
    resetGame();
    $('.O').text('0');
    $('.X').text('0');
}

function prompt(){
    $('#prompt').css('display', 'flex');
    
    $('#yes').on('click', (e) => {
        resetEntireGame();
    });
    
    $('#no').on('click', () => {
        $('#prompt').css('display', 'none');
    });
}

//quering the elements we are targeting in the html 
let reset = document.querySelector('#reset').addEventListener('click', resetBtn);
socket.emit('reset', reset);
