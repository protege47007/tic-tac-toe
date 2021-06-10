const express = require("express");
const bp = require("body-parser");

const app = express();

app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));

let server = require('http').createServer(app);

let io = require('socket.io')(server, {cors: {origin: "*"}});

server.listen(3030, () => {
    console.log("SERVER is listening on port: 3030");
});


//home router
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html"); 
});

//record holder for users
let users = [];
io.on('connection', (socket) => {
    console.log("a user has connected with id: " + socket.id);
    
    //emitting the message sent to all users on the server
    socket.emit('id', socket.id);
    
    //receiving username
    socket.on('nomId', (nom) => {
        let newPl = {
            name: nom,
            id: socket.id
        }
        users.push(newPl);
        updateUser();
    });
    

    const updateUser = () => {
        //this initialises the function to be called on the client side
        //for passing data
        socket.emit('usersDb', users);
    }    
    
    

    //broadcasting to all user except the emitiing socket
    //socket.broadcast.emit('message', data);
    
});