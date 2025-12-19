const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const PORT = 5000;

const app = express();
const server = http.createServer(app);
let history  = []
const io = new Server( server, {
    cors : {
        origin : 'http://localhost:3000',
        methods : ["GET", "POST"]
    }
});


io.on('connection' , (socket) => {
    console.log( "A user connected: ", socket.id );

    socket.emit('load history', history);

    socket.on('drawing', (data) => {
        history.push(data);

        socket.broadcast.emit('drawing', data);
    });
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})
