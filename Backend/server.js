const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: generateId } = require('uuid');
const Room = require('./models/Room');
const generatedName = require('sillyname');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow WebSocket connections from any origin
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 8080;
const DBLink = process.env.MONGODB_URI;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database Connection
mongoose.connect(DBLink).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Socket.IO Events
io.on('connection', (socket) => {
  const name = generatedName();

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });

  // Chat messages within a room
  socket.on('chatMessage', (roomId, message) => {
    io.to(roomId).emit('chatMessage', { message, senderId: name });
  });

  // Create a new room
  socket.on('createRoom', async () => {
    try {
      let roomId = generateId();
      roomId = roomId.slice(0,20);
      console.log(roomId);
      const newRoom = new Room({
        roomId,
        participants: [{ socketId: socket.id, joinedAt: new Date() }],
        videoState: {
          videoUrl: '', 
          currentTime: 0,
          isPlaying: false,
        },
      });

      await newRoom.save();
      socket.join(roomId);
      socket.emit('roomCreated', roomId);

      console.log(`Room ${roomId} created by ${socket.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error', 'An error occurred while creating the room');
    }
  });

  // Join an existing room
  socket.on('joinRoom', async (roomId) => {
    try {
      const room = await Room.findOne({ roomId });

      if (room) {
        room.participants.push({ socketId: socket.id, joinedAt: new Date() });
        await room.save();

        socket.join(roomId);
        socket.emit('roomJoined', roomId);
        socket.to(roomId).emit('userJoined', socket.id);

        console.log(`User ${socket.id} joined room ${roomId}`);
      } else {
        socket.emit('error', 'Room does not exist');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'An error occurred while joining the room');
    }
  });

  // Handle video synchronization events
  socket.on('videoEvent', ({ roomId, type, time, videoId }) => {
    socket.to(roomId).emit('videoEvent', { type, time, videoId });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
