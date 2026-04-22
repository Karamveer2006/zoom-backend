import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import {connectToSocket}  from './controllers/socketManager.js';
import userRoutes from './routes/users.route.js';


const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({limit: '40kb'}));
app.use(express.urlencoded({limit: '40kb', extended: true}));

const server = createServer(app);
const io =connectToSocket(server);

const main=async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to database');
  } catch (error) {
    console.log('error connecting to database', error);
  }
};

main();

app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});