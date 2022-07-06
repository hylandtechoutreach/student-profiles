const Student = require("./models/Student");

module.exports = {
	addStudent: async function(studentObj) {
    let studentSchool = studentObj.school
    if (studentObj.school == "other"){
      studentSchool = studentObj.other_school
    }
    const newStudent = new Student({
      first_name: studentObj.first_name,
      last_name: studentObj.last_name,
      grade: studentObj.grade,
      school: studentSchool,
      email: studentObj.email,
      school: studentSchool,
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`
    });

    await newStudent.save();
	},
  getLastNameCount: async function(lastName) {
	  return await Student.find({last_name : lastName}).count() + 1 
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
    let studentSchool = studentObj.school
    if (studentObj.school == "other"){
      studentSchool = studentObj.other_school
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