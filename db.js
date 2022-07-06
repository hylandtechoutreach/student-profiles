const Student = require("./models/Student");

module.exports = {
	addStudent: async function(studentObj) {
    const newStudent = new Student({
      first_name: studentObj.first_name,
      last_name: studentObj.last_name,
      grade: studentObj.grade,
      school: studentObj.school,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      email: studentObj.email,
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`,
      status: "active"
=======
      id_number: `${studentObj.last_name}.${getLastNameCount(studentObj.last_name)}`
>>>>>>> 3bd975b (fix)
=======
      id_number: `${studentObj.last_name}.${ await getLastNameCount(studentObj.last_name)}`
>>>>>>> 2b64eb3 (fix)
=======
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`
>>>>>>> 755d8a5 (fix)
=======
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`,
      status: "active"
>>>>>>> f81c606 (Changed delete and added reactivate button)
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