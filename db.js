const Student = require("./models/Student");

module.exports = {
	addStudent: async function(studentObj) {
    let studentSchool = studentObj.school
<<<<<<< HEAD
    if (studentObj.school == "Other"){
=======
    if (studentObj.school == "other"){
>>>>>>> 972279c8fb00e1fe6a986a1a34c60ce0d3e72258
      studentSchool = studentObj.other_school
    }
    const newStudent = new Student({
      first_name: studentObj.first_name,
      last_name: studentObj.last_name,
      grade: studentObj.grade,
<<<<<<< HEAD
<<<<<<< HEAD
      school: studentObj.school,
=======
      school: studentSchool,
>>>>>>> 972279c8fb00e1fe6a986a1a34c60ce0d3e72258
      email: studentObj.email,
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`,
      status: "active",
=======
>>>>>>> 6708b5a (capitalization fixed, other school text field needs work)
      school: studentSchool,
<<<<<<< HEAD
    })
=======
      email: studentObj.email,
      school: studentSchool,
      id_number: `${studentObj.last_name}.${ await module.exports.getLastNameCount(studentObj.last_name)}`
    });

>>>>>>> 8ac69ba (updated db.js to include email)
    await newStudent.save();
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
    let studentSchool = studentObj.school
<<<<<<< HEAD
    if (studentObj.school == "Other"){
=======
    if (studentObj.school == "other"){
>>>>>>> 972279c8fb00e1fe6a986a1a34c60ce0d3e72258
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