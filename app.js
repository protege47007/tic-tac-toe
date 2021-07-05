const express = require("express");
const bp = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended: true}));

let server = require('http').createServer(app);

let io = require('socket.io')(server, {cors: {origin: "*"}});

server.listen(3030, () => {
    console.log("SERVER is listening on port: 3030");
});


//home router
app.get('/', (req, res) => {
    res.render 
});

//record holder for users
let users = [];
io.on('connection', (socket) => {
    console.log("a user has connected with id: " + socket.id);
    let id = socket.id;
    
    //receiving username
    socket.on('nomId', (nom) => {
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
    
    
});