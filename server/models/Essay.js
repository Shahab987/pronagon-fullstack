const mongoose = require("mongoose");

const essaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const EssayModel = mongoose.model("Essay", essaySchema);

module.exports = EssayModel;
