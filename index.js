import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors'

import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import { userJoin, getCurrentUser, userLeave } from './utils/users.js';
import { capitalize } from "./utils/Text/index.js";

import userRoutes from './routes/users.js'
import chatRoutes from './routes/messages.js'


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,       
    optionSuccessStatus:200
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const CONNECTION_URI = process.env.CONNECTION_URI;

// Initialize Database
mongoose.connect(CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log('Database initialized!')
});

const db = mongoose.connection;
db.on('error', (e) => console.log(e.message));

//Middlewares
app.use(express.json());

//routes
app.use('/auth/', userRoutes);
app.use('/chat/', chatRoutes);

const rooms = {};

// Initailize Socket Connection
io.on('connection', (socket) => {
    socket.on('joinChat', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('newChat', {username: 'ADMIN', message:`${capitalize(user.username)} has joined the chat`})

    })

    socket.on('newMessage', (data) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('newChat', { username: user.username, message: data.message })
    });

    
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('newChat', { username: 'ADMIN', message: `${capitalize(user.username)} has left the chat` });
        }
    });

    // Video Call
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }

        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });


    // socket.on('disconnect', () => {
    //     socket.broadcast.emit("user left");
    // })

});

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})