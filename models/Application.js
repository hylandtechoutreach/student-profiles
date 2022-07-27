const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  student: {
    type: Object,
    required: true
  },
  program: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'accept', 'deny'],
    default: 'new',
    required: true
  },
 
});

module.exports = Application = mongoose.model("applications", ApplicationSchema);
