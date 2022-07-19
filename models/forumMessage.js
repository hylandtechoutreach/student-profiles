const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
})
module.exports = Student = mongoose.model("forumMessage", messageSchema);