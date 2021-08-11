//dependecies declaration into constants
const express = require("express");
const ejs = require('ejs');
const port = process.env.PORT || 3030;
const app = express();

//setting up express to use body-parser, static files, ejs templating engine
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

//creating our server
let server = require('http').createServer(app);
//requiring our socket dependencies
const io = require('socket.io')(server, {cors: {origin: "*"}});


//record holder for users
let users = [];

//our form prompter for error
let exists = false; 
let fail;
const errNote = () => {
   return exists == true ? fail = 'name already exists! please change or add a number.':'';
}

//variable to carry names globally
let x; let key;

//home router
app.get('/', (req, res) => {
    res.render('home', {err: fail});
});

//form's post route to check if name exists and also game mode
app.post('/check', (req, res) => {
    let mode = req.body.mode;
    x = req.body.nickname;
    key = req.body.OCkey
    //checks the game mode 
    if (mode == 'online') {
        //checking our database to see if user's inputed name already exists
        if (users.length > 0 && users.indexOf(x) != -1) {
            exists = true;
            errNote();
            res.redirect('/');        
        }else{
        users.push(x);
        console.log('getter route', users);
        res.redirect('/online-game');
        }
    } else {        
        res.redirect('/offline-game');
    }
});

//offline game mode route getter
app.get('/offline-game', (req, res) => {
    
    res.render('offline', {
        player1: x,
        player2: 'COM'
    });
});

//online game mode route getter
app.get('/online-game', (req, res) => {
    let p1 = users[0];
    let p2 = users[1];
    res.render('online',
    {
        player1: p1,
        player2: p2
    });
});



let profiles = [];
//socket.io server swop
io.on("connection", (socket) => {
  socket.join(key)
  let id = socket.id;
  socket.username = x;
  // socket.emit('id', {id: socket.id, nom: socket.username});
  

  let b = {
    id: socket.id,
    name: x,
    room: key
  };
  profiles.push(b);
  if (profiles.length == 2) {
    io.to(key).emit('userDb', profiles);  
  }
  
  console.log(profiles);
  
  socket.on('clearScreen',(datum)=>{
    io.to(key).emit('clearScreen', datum);
  });

  socket.on("ClickedTile", (e) => {
    io.to(key).emit("play", e);
  });


  socket.on("disconnect", (data) => {
    profiles.forEach((e, i) => {
      if (e.id === socket.id) {
        users.splice(users.indexOf(e.name), 1);
        profiles.splice(i, 1);
        io.to(key).emit("usersDb", profiles);
      }
    });
  });


  socket.on("reset", () => {
    io.to(key).emit("Reset-Game");
  });


  socket.on('text', (e)=>{
      io.to(key).emit('new', e);
  });
});
   
//server listener
server.listen(port, () => {
    console.log("SERVER is listening on port: 3030 or ", port);
});