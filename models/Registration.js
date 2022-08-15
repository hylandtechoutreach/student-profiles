const mongoose = require("mongoose")
const Schema = mongoose.Schema
//if you add somthing to registration_db.js to be sent to the db, you must also add it here
const RegistrationSchema = new Schema({
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
    enum: ['active', 'accept', 'deny', 'disabled'],
    default: 'active',
    required: true
  },

});

module.exports = Registration = mongoose.model("registrations", RegistrationSchema)
