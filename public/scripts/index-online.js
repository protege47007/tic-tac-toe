//socket.io initialisation
// //this activates the connection function on the server side
// socket.on('connection');
const Url = 'http://localhost:3030';
const socket = io(Url, {autoconnect: true});


//querying the waiting for other players screen
const plTab = document.querySelector('.players');


//player profile declaration
const PlayerProfile = function (name, id, piece){
    //the name is supplied by ejs
    this.name = name;
    if (this.name == null) {
        window.history.back();
    }
    //on creation sscore is default to 0
    this.score = 0;
    //supplied by the io to ensure it is the socket's id
    this.id = id;
    //alternates after a win or draw
    this.piece = piece;
    //this triggered when a player has won
    this.won = () => {
        //score is increased
        this.score++;
        //game piece is alternated
        this.piece === 'X' ?  this.piece = 'O' :  this.piece =  'X';
    }
    //this indicates the player/socket's turn to play
    this.play = (cId)=>{
        //checks to see if it is this socket's turn to enable him play
        if (cId === socket.id) {
            //querying the indivdual game tile
            let q = document.querySelectorAll('.tile');
            //looping through each tile that was queried
            q.forEach( (e,i) => {
                //adds a css class that makes them look clickable
                e.classList.add('active');
                //adds event listeners to each tile
                e.addEventListener('click', carrier);
            });
        }
    }
    //this is triggered when it is not this socket's turn to play
    this.blockPlay = (cId) => {
        console.log('block method activated');
        //checks to make sure if it concerns this socket
        if (cId === socket.id) {
            console.log('currentpl id is socket.id');
            //then removes the css clickable class and event listener
            document.querySelectorAll('.tile').forEach( (e,i) =>{ 
                console.log('reached loop successfully', e);
                e.removeEventListener('click', carrier);
                console.log('successfully removed');
                e.classList.remove('active');
            });
        }
    }

}
const carrier = function(i){
    let tile = i.target
    let index = parseInt(tile.getAttribute('data-index'));
    socket.emit('ClickedTile', index);
}
//holding cell for player profiles from the io
let users = [];

//players declaration
//global variables to hold the name
let a, b, a1, a2;

//global variable for the two players
let playerOne, playerTwo;
let currentPl;
//accessing players' name
let p1 = document.querySelector('.pl-one');
let p2 = document.querySelector('.pl-two');


//waiting screen for player before game begins
//appending players name to waiting screen.. might not be necesarry tho
let fish = document.querySelector('#tab');

const append  = (text)=>{
    let t = document.createElement('p');
    t.textContent = text;
    fish.appendChild(t);
}
//this removes the waiting screen when the second player enters the game
const check = function(){
    console.log(users, 'from check function');
    if (users.length == 2) {
      socket.emit('clearScreen', true);
      a = users[0].name;
      a1 = users[0].id;
      b = users[1].name;
      b1 = users[1].id;
      //since the name is supplied from the ejs it won't appear on the other player screen without using the io
      //to supply it without refreshing
      p1.innerHTML = a;
      p2.innerHTML = b;
      startGame();
    }else if (users.length < 2) {
        socket.emit('clearScreen', false);
    }
}
socket.on('clearScreen', (e)=>{
    console.log(e);
    if (e) {
        plTab.style.display = "none";
    } else {
        plTab.style.display = "block";
    }
})

//users cell listener from the io
socket.on('userDb', (data)=>{
    console.log(data);
    data.forEach((e)=>{
    if (users.indexOf(e) == -1) {
        // fish.textContent = "";
        //appending the name to the waiting screen
        append(e.name);
        //pushing the new guy to the array
        users.push(e);
    }
});
    //calls the check function to try removing the wait screen for game to start
    check();
});

function startGame() {
  //player profile declaration
  playerOne = new PlayerProfile(a, a1, "x");
  playerTwo = new PlayerProfile(b, b1, "O");

  //querying the game status screen selector
  const status = document.querySelector(".newStatus");

  //variable declarations
  let active = true;
  //selecting the current player to start game
  currentPl = playerOne;
  //to enable the current play kick off the game
  currentPl.play(currentPl.id);
  //to know the player started the game so it can interchange
  let startPl = playerOne;
  //this triggered after a win or draw
  const changeStartPlayer = function () {
    startPl == playerOne ? (startPl = playerTwo) : (startPl = playerOne);
  };

  const updateScoreBoard = () => {
    document.querySelector('#pl1-score').textContent = String(playerOne.score);
    document.querySelector('#pl2-score').textContent = String(playerTwo.score);
    if (playerOne.piece === 'X') {
        playerTwo.piece = 'X'; playerOne.piece = 'O'
    } else {
        playerOne.piece = 'X'; playerTwo.piece = 'O'
    }
    
    }


  //keeps recored of the game state
  let state = ["", "", "", "", "", "", "", "", ""];

  //game status prompter
  const win = () => `${currentPl.name} has won!`;

  const draw = () => "Game is a draw";

  const plTurn = () => `its ${currentPl.name}'s turn`;
  //this indicates whose turn it is to start the game;
  status.textContent = plTurn();

  //function to handle the tile that has been clicked
  function sqPlayed(sqClicked, sqIndex) {
    //passes the player's piece to the game state
    state[sqIndex] = currentPl.piece;
    //marks the clciked tile as played with the player's tile
    sqClicked.innerHTML = currentPl.piece;
  }

  //function to handle player change and tile event listener after a play
  function plChange() {
    if (currentPl === playerOne) {
      currentPl.blockPlay(currentPl.id);
      currentPl = playerTwo;
      currentPl.play(currentPl.id);
    } else {
      currentPl.blockPlay(currentPl.id);
      currentPl = playerOne;
      currentPl.play(currentPl.id);
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
    [0, 4, 8],
  ];

  //function to constantly check after a play to check if there's a wining combo
  function resultCheck() {
    let won = false;

    //first we loop through the wining combos array (i.e. it is a nested array)
    for (let i = 0; i <= 7; i++) {
      //since each array in the wining combo has three (3) elements, we assign them to an identifier
      const winCombo = winingCombos[i];
      let a = state[winCombo[0]];
      let b = state[winCombo[1]];
      let c = state[winCombo[2]];

      //this checks to see if the array is empty
      if (a === "" || b === "" || c === "") {
        continue;
      }

      //this checks to see if there's a wining combo then breaks the loop
      if (a === b && b === c) {
        won = true;
        break;
      }
    }

    //in the event of a wining combo been spotted, a truthy value is recieved from above
    if (won) {
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
  function sqClick(e) {
    const sqClicked = e; //.target;
    // console.log(`sqclick ${e}`);
    //this gets the index attribute of the tile clicked
    const sqIndex = parseInt(sqClicked.getAttribute("data-index"));

    if (state[sqIndex] !== "" || !active) {
      return;
    }

    sqPlayed(sqClicked, sqIndex);
    resultCheck();
  }

  //socket recieving other player's move
  socket.on("play", (f) => {
    console.log(`socket on play: `, f);
    let q = document.querySelectorAll(".tile");
    q.forEach((e, i) => {
      if (i === f) {
        // console.log(e);
        sqClick(e);
       }// else {
    //     console.log(`sqclick: ${i} e no work oh`);
    //   }
    });
  });

  //this resets the board but not the scoreoard ***Updated**
  function resetGame() {
    active = true;
    currentPl = startPl;
    state = ["", "", "", "", "", "", "", "", ""];
    status.innerHTML = plTurn();
    document.querySelectorAll(".tile").forEach((e) => (e.innerHTML = ""));
  }

  // this resets the board and the scoreboard
  function resetBtn() {
    document.querySelector(".confirm").style.display = "flex";

    document.querySelector("#yes").addEventListener("click", () => {
      socket.emit("reset");
    });

    document.querySelector("#no").addEventListener("click", () => {
      document.querySelector(".confirm").style.display = "none";
    });
  }

  //resets the entire to start a fresh
  function resetEntireGame() {
    resetGame();
    playerTwo.score = 0;
    playerOne.score = 0;
    updateScoreBoard();
  }

  //io listener to reset the game so one player won't reset while the other keeps playing
  socket.on("Reset-Game", () => {
    resetEntireGame();
  });

  //quering the elements we are targeting in the html
  let reset = document
    .querySelector("#reset")
    .addEventListener("click", resetBtn);
}




const appnd = function(text){
    let y = document.createElement('p');
    y.textContent = text;
    fish.appendChild(y);
}

let ish = document.querySelector('#ish');
function something(){

    socket.emit('text', ish.value);
}


socket.on('new', (e)=>{
    appnd(e);
});