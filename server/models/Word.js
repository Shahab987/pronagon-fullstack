const mongoose = require("mongoose");

// Define schema
const wordSchema = new mongoose.Schema({
  name: String,
  meaning: String,
  audio_us: String,
  audio_src: String,
  length: Number,
  level: Number,
  pronunciation: String,
  example: String,
  details: Object,
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

wordSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

// Define model
const WordModel = mongoose.model("Word", wordSchema);

module.exports = WordModel;
