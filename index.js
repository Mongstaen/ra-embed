const path = require('path');
const fs = require('fs');
const store = 'app/store.json';
const express = require('express');
const formidable = require('express-formidable');var app = express();
app.use(express.static(path.join(__dirname, 'app')));
app.use(formidable());
const server = require('http').createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

const readFile = function (file) {
    return JSON.stringify(fs.readFileSync(file).toString());
};

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
        'artist': req.fields.artist,
        'title': req.fields.title,
    }));

    fs.writeFile(store, JSON.stringify(req.query), (err) => {
        if (err) throw err;
    });
    
    console.log(req.fields);
    res.sendStatus(200); 
});

server.listen(8080);
console.log('Server started at port 8080');