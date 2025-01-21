const mongoose = require('mongoose');
require('dotenv').config();



const RoomSchema = new mongoose.Schema({
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    participants: [
      {
        socketId: String, // User's Socket.IO ID
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videoState: {
      videoUrl: { type: String, default: '' }, // URL of the video
      currentTime: { type: Number, default: 0 }, // Current playback time
      isPlaying: { type: Boolean, default: false }, // Play/pause state
    },
  });

module.exports = mongoose.model('Room', RoomSchema);