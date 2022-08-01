const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  },
  status: {
    type: String,
    enum: ['new', 'accept', 'deny', 'disabled', 'reinstated'],
    default: 'new',
    required: true
  },
 
});

module.exports = Application = mongoose.model("applications", ApplicationSchema);
