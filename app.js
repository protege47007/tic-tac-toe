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
let exists = false; let fail;
exists == true ? fail = 'name already exists! please change or add a number.' : '';
//variable to carry names globally
let x;

//home router
app.get('/', (req, res) => {
    res.render('home', {err: fail});
});

//form's post route to check if name exists and also game mode
app.post('/check', (req, res) => {
    let mode = req.body.mode;
    x = req.body.nickname;
    
    //checks the game mode 
    if (mode == 'online') {
        //checking our database to see if user's inputed name already exists
        if (users.length > 0 && users.indexOf(x)) {
            exists = true;
            res.redirect('/');        
        }else{
        users.push(x);
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

    res.render('online', {
        player1: p1,
        player2: p2
    });
});

//socket.io server swop
io.on('connection', (socket) => {
    console.log("a user has connected with id: " + socket.id);
    let id = socket.id;
    
    socket.on('ClickedTile', (target) => {
        socket.emit('play', target);
    });


    //receiving username
    socket.on('newUser', (nom) => {
        if (users.length > 1) {
            users.forEach( (e) => {
                if (nom !== e.name) {
                  createUser(nom, id);  
                } else {
                    e.id = socket.id;
                }
            });
        } else {
            createUser(nom, id);
        }
    });
    
    function createUser(nom, id) {
        let newPl = {
            name: nom,
            id: id
        };
        users.push(newPl);
        socket.emit('usersDb', users);
    }
        //this initialises the function to be called on the client side
        //for passing data
        
    
    
    

    
    socket.on('status', (data) =>{
        socket.emit('UpdateStatus', data);
    });

    socket.on('reset', (data) => {
        socket.emit('Reset-Game', data);
    });
    


    socket.on('newUser', (nom) => {
        socket.emit('append', nom);
    });
});
    
server.listen(port, () => {
    console.log("SERVER is listening on port: 3030 or ", port);
});