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
let user = [];
io.on('connection', (socket) => {
    console.log("a user has connected with id: " + socket.id);


    //this initialises the function to be called on the client side
    //for passing data
    socket.on('connect', (data) => {    
    

        //emitting the message sent to all users on the server
        socket.emit('receive', data);

        //broadcasting to all user except the emitiing socket
        //socket.broadcast.emit('message', data);
    });
});