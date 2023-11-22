const path = require('path');
const fs = require('fs');
const store = 'app/store.json';

const express = require('express');
var app = express();
app.use(express.static(path.join(__dirname, 'app')));
const server = require('http').createServer(app);


const { Server } = require('socket.io');
const io = new Server(server);

const readFile = function (file) {
    return JSON.stringify(fs.readFileSync(file).toString());
};

console.log(JSON.parse(readFile(store)));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/RA', function (req, res) {
    res.sendFile(__dirname + '/app/radioaskoy.html');
});

app.get('/data', function (req, res) {
    res.send(JSON.parse(readFile(store)));    
});

app.post('/data', function (req, res) {
    var socket = io;
    socket.emit('message', JSON.stringify({
        'artist': req.query.artist,
        'title': req.query.title,
    }));

    fs.writeFile(store, JSON.stringify(req.query), (err) => {
        if (err) throw err;
    });

    // TODO lagre siste info 

    console.log(req.query);
    res.sendStatus(200); 

});

server.listen(8080);
console.log('Server started at port 8080');