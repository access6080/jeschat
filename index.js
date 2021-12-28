import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/users.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})