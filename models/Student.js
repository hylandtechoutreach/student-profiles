const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Program = require("../models/Program");

// Create Schema
const StudentSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  grade: {
    type: String,
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
  email: {
    type: String,
    required: true
  },
  program_list: {
    type: [[Program.program_id_number, String]],
    // enum:[id_number, note],
    required: true
  },
  note: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true
  }
});

module.exports = Student = mongoose.model("students", StudentSchema);