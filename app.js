const express = require("express");
const ejs = require('ejs');
const port = process.env.PORT || 3030;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

let server = require('http').createServer(app);

let io = require('socket.io')(server, {cors: {origin: "*"}});


//record holder for users
let users = []; let exists = false; let fail;
exists == true ? fail = 'name already exists! please change or add a number.' : '';
let x;
//home router
app.get('/', (req, res) => {
    res.render('home', {err: fail});
});

app.post('/check', (req, res) => {
    let mode = req.body.mode;
    x = req.body.nickname;
    
    if (mode == 'online') {
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

app.get('/offline-game', (req, res) => {
    
    res.render('offline', {
        player1: x,
        player2: 'COM'
    });
});

app.get('/online-game', (req, res) => {
    let p1 = users[0];
    let p2 = users[1];

    res.render('online', {
        player1: p1,
        player2: p2
    });
});


io.on('connection', (socket) => {
    console.log("a user has connected with id: " + socket.id);
    let id = socket.id;
    
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
        
    
    
    
    socket.on('play', (data) => {
        socket.emit('receivingPlay', data);
    });
    
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