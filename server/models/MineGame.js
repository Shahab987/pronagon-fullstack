const mongoose = require("mongoose");

// Add new Mine Game Schema
const MinePlayerSchema = new mongoose.Schema({
  name: String,
  isAdmin: Boolean,
  disconnected: Boolean,
  role: String,
});

const MineGameSchema = new mongoose.Schema({
  players: [MinePlayerSchema],
  gameCode: Number,
  status: String,
  settings: {
    numPlayers: Number,
    numCitizens: Number,
    numMine: Number,
    roles: {
      doctor: Boolean,
      detective: Boolean,
      godfather: Boolean,
      mayor: Boolean,
      sniper: Boolean,
      clown: Boolean,
    },
  },
  assignedRoles: [
    {
      playerName: String,
      role: String,
    },
  ],
});

const MineGame = mongoose.model("MineGame", MineGameSchema);

module.exports = MineGame;
