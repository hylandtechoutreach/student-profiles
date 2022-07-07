const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
<<<<<<< HEAD
<<<<<<< HEAD
  },
  email: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  guardianEmail: {
    type: String,
    required: false
  },
  guardianPhone: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  interestsAndHobies: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
=======
>>>>>>> 6452635 (Student ID added)
=======
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true
>>>>>>> 4e59264 (Changed delete and added reactivate button)
  }
});

module.exports = Student = mongoose.model("students", StudentSchema);