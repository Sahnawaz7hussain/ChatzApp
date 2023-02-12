const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: String,
  from: String,
  socketId: String,
  time: String,
  date: String,
  to: String,
  sender: Object,
});

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = { MessageModel };
