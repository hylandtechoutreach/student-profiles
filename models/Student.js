const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    enum: ['6th', '7th', '8th', '9th', '10th', '11th', '12th', 'College Freshman', 'College Sophmore', 'College Junior', 'College Senior', 'Out of School'],
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
    required: true
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
    required: true
  },
  interestsAndHobies: {
    type: String,
    required: false
  },
  program_list: {
    type: [Object],
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
