require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const Stroke = require ('./models/Stroke');



const app = express();
app.use(cors());

const server = http.createServer(app);

const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
    .then(() => console.log("mongoDb connected!"))
    .catch((err) => console.error("mongo error: ", err));


const io = new Server( server, {
    cors : {
        origin : '*',
        methods : ["GET", "POST"]
    }
});


io.on('connection' , (socket)   => {
    console.log( "A user connected: ", socket.id );

    socket.on('join-room',  async(roomId) =>{
        socket.join(roomId);
        console.log(`USer joined Room: ${roomId}`);

        try {
            const history = await Stroke.find({ "roomId": roomId });
            socket.emit('load-history', history);
        } catch(err) {console.error("Loading history error :", err);}

    });

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('save-stroke', async (data) =>{
        try{
            const newStroke = new Stroke({
                roomId: data.roomId,
                options: data.options,
                points: data.points
            });

            await newStroke.save()
            console.log("saved Stroke!")
        }
        catch (err) {
            console.error("Error: ", err);
        }
    })

    socket.on('clear', async (roomId) => {
        try{

            await Stroke.deleteMany({ roomId: roomId });
            console.log("cleared history!");

            io.to(roomId).emit('clear');
            
        } catch(err){console.error("failed to clear history: ", err);}
    });
});

server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})
