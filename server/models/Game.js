const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Will store socket.id
  name: String,
  disconnected: Boolean,
  word: String,
  role: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
});

const gameSchema = new mongoose.Schema({
  gameCode: { type: Number, required: true, unique: true },
  status: { type: String, default: "waiting" },
  players: [playerSchema],
  settings: {
    maxPlayers: { type: Number, default: 20 },
    currentWord: { type: String, default: "" },
    wordSetBy: { type: String, default: "" },
  },
  selectedWord: { type: String, default: "" },
  assignedRoles: [
    {
      playerName: String,
      role: String,
    },
  ],
});

module.exports = mongoose.model("Game", gameSchema);
