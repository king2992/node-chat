const express = require('express');

const fs = require('fs');


const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    let username = '';

    socket.on('chat message', (data) => {
        const message = { username: username || '익명', message: data.message };
        io.emit('chat message', message);
        saveMessage(message);
    });

    socket.on('set username', (name) => {
        username = name;
    });

    socket.on('request history', () => {
        sendChatHistory(socket);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

function saveMessage(message) {
    const log = require('./log.json');
    log.push(message);
    fs.writeFileSync('./log.json', JSON.stringify(log, null, 2));
}

function sendChatHistory(socket) {
    const log = require('./log.json');
    socket.emit('chat history', log);
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
