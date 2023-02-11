const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: String,
  from: String,
  socketId: String,
  time: String,
  date: String,
  to: String,
});

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = { MessageModel };
