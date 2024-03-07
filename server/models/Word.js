const mongoose = require("mongoose");

// Define schema
const wordSchema = new mongoose.Schema({
  name: String,
  meaning: String,
  audio_us: String,
  length: Number,
  level: Number,
  pronunciation: String,
  example: String,
  details: Object,
});

// Define model
const WordModel = mongoose.model("Word", wordSchema);

module.exports = WordModel;
