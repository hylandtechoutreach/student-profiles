const mongoose = require("mongoose")
const Schema = mongoose.Schema
const constants = require("../routes/constants")

const ProgramSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  min_grade_level: {
    type: String,
    enum: constants.getGradeLevels(),
    required: true
  },
  max_grade_level: {
    type: String,
    enum: constants.getGradeLevels(),
    required: true
  },
  program_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true
  },
  isRegistrationRequired: {
    type: Boolean,
    required: true
  }
})

module.exports = Program = mongoose.model("programs", ProgramSchema)