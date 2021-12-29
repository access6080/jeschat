import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/users.js'
import chatRoutes from './routes/messages.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
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

// Initailize Socket Connection
io.on('connection', (socket) => {
    socket.on('newMessage', (data) => {
        io.emit('newChat', data)
    })
});

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})