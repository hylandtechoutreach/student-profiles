const Student = require("../models/Student");

module.exports = {
	addStudent: async function(studentObj) {
    if(studentObj.email.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
    const newStudent = new Student({
      first_name: studentObj.first_name,
      last_name: studentObj.last_name,
      grade: studentObj.grade,
      school: studentObj.school,
      email: studentObj.email,
      phone_number: studentObj.phone_number,
      dateOfBirth: studentObj.dateOfBirth,
      guardianPhone: studentObj.guardianPhone,
      guardianEmail: studentObj.guardianEmail,
      notes: studentObj.notes,
      interestsAndHobies: studentObj.interestsAndHobies,
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`,
      status: "active"
      
    });
    await newStudent.save();
  }
	},
  getLastNameCount: async function(lastName) {
    return await Student.find({last_name : lastName}).countDocuments() + 1 
	},
	getStudentsList: async function() {
	  return await Student.find({});
	},

	getStudentById: async function(studentId) {
    return await Student.findOne({
      _id: studentId
    });
	},

	editStudentById: async function(studentId, newStudentObj) {
    let studentSchool = studentId.school
    if (studentId.school == "other"){
      studentSchool = studentId.other_school 
    }
    await Student.findOneAndUpdate({
      _id: studentId
    },
    newStudentObj,
    {
      runValidators: true
    });
	},

	deleteStudentById: async function(studentId) {
    await Student.findOneAndRemove({
      _id: studentId
    });
	}
}