const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
let history  = []
const io = new Server( server, {
    cors : {
        origin : '*',
        methods : ["GET", "POST"]
    }
});


io.on('connection' , (socket)   => {
    console.log( "A user connected: ", socket.id );

    socket.emit('load-history', history);

    socket.on('drawing', (data) => {
        history.push(data);

        socket.broadcast.emit('drawing', data);
    });

    socket.on('clear', () => {
        history= [];
        io.emit('clear');
    });
});

server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})
