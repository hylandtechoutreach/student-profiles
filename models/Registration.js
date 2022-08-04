const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
 
})

module.exports = Registration = mongoose.model("registrations", RegistrationSchema)
