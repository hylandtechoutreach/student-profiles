const mongoose = require("mongoose")
const Schema = mongoose.Schema
const constants = require("../routes/constants")
//if you add somthing to db.js to be sent to the db, you must also add it here
const StudentSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  guardian_Name: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    enum: constants.getGradeLevels(),
    required: true
  },
  school: {
    type: String,
    required: true
  },
  id_number: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  guardianEmail: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  countryCodeGuardian: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  interestsAndHobies: {
    type: String,
    required: false
  },
  internalNotes: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true
  }
})

module.exports = Student = mongoose.model("students", StudentSchema)
