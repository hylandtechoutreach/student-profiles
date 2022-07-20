const Student = require("../models/Student");
const userDb = require('../auth/models');
const User = userDb.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../auth/config/auth.config");

module.exports = {
	addStudent: async function(studentObj) {
    let format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(studentObj.email.toLowerCase().match(format) && studentObj.guardianEmail.toLowerCase().match(format)) {
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

    const newUser = new User({
			username: newStudent.first_name,
			email: newStudent.email,
			password: bcrypt.hashSync(studentObj.password, 8),
			userType: 'student',
      studentId: newStudent.id
		  });
		
		  newUser.save((err, user) => {
			if (err) {
			  return;
			}
    });
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
    let format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(newStudentObj.email.toLowerCase().match(format) && newStudentObj.guardianEmail.toLowerCase().match(format)) {
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

      User.findOne({ studentId: studentId }).exec((err, user) => {
        user['password'] = bcrypt.hashSync(newStudentObj.password, 8);
        User.findOneAndUpdate({
          _id: user.id
        },
        user,
        {
          runValidators: true
        });
  
        user.save((err, user) => {
          if (err) {
            return;
          }
        })
      });
    }
	},

	deleteStudentById: async function(studentId) {
    await Student.findOneAndRemove({
      _id: studentId
    });
	}
}