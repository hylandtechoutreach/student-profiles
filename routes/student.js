const { response } = require("express")
const db = require("../database/db")
const program_db = require("../database/program_db")
const application_db = require("../database/application_db")
const applicationFile = require("./application")
var mongoose = require('mongoose');
const countries = require("countries-list").countries;
const moment = require('moment');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../auth/models/user.model')
const config = require('../auth/config/auth.config')

module.exports = {
	addStudentPage: async function (request, response) {
		let programList = await program_db.getProgramsList()
		let renderData = {
			student: {},
			add: true,
			view: false,
			countries: countries,
			programs: module.exports.activePrograms(programList),
			applications: await applicationFile.activeApplications(),
		}

		response.render('edit-student', renderData)
	},

	viewStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		let dateOfBirth = moment.utc(studentObj.dateOfBirth);
		studentObj['dateOfBirthFormatted'] = dateOfBirth.format('YYYY[-]MM[-]DD');
		
		let programList = await program_db.getProgramsList();
		let renderData = {
			student: studentObj,
			add: false,
			view: true,
			programs: await applicationFile.getProgramListByStudentId(studentId),
			applications: await applicationFile.activeApplications(),
			countries: countries
		};

		response.render('edit-student', renderData)
	},

	editStudentPage: async function (request, response) {
		let studentId = request.params.id
		let studentObj = await db.getStudentById(studentId)
		let programList = await program_db.getProgramsList()
		let applicationList = await applicationFile.activeApplications()

		let dateOfBirth = moment.utc(studentObj.dateOfBirth);
		studentObj['dateOfBirthFormatted'] = dateOfBirth.format('YYYY[-]MM[-]DD');
		
		let renderData = {
			student: studentObj,
			view: false,
			programs: module.exports.activePrograms(programList),
			applications: applicationList,
			add: false,
			countries: countries
		};
		response.render('edit-student', renderData)
	},

	addStudent: async function (request, response) {
		if (request.body.studentEmail) {
			request.body['email'] = request.body.studentEmail
		}
		const newStudent = await db.addStudent(request.body)
		
		const user = new User({
			username: request.body.studentUsername,
			email: request.body.studentEmail,
			password: bcrypt.hashSync(request.body.studentPassword, 8),
			userType: 'student',
			studentId: newStudent._id
		  });
	  
		  user.save((err, user) => {
			if (err) {
			  let renderData = {
				message: err
			  }
			  return response.render('signin', renderData)
			} else {
				//Automatically signs user in after signup
				let token = jwt.sign({ id: user.id }, config.secret, {
					expiresIn: '1h'
				  });
			  
				  response.cookie('token', token, {
					httpOnly: true
				  });
			  
				  if (request.body.userType) {
					let renderData = {
					  message: "User was registered successfully!"
					}
					return response.render('signin', renderData)
				  }
				}
			})
	},
	
	editStudent: async function (request, response) {
		
		let studentId = request.params.id
		let programIds = []
		await application_db.deleteApplicationByStudentId(studentId)
		if(request.body.program_list !== undefined) {
		for(let i = 0; i < request.body.program_list.length; i++) {
			programIds.push(request.body.program_list)
		}
		if(request.body.program_list.length == 24) {
			await application_db.addApplication(studentId, mongoose.Types.ObjectId(request.body.program_list))
		} else {
			for(let i = 0; i < request.body.program_list.length; i++) {
				await application_db.addApplication(studentId, mongoose.Types.ObjectId(request.body.program_list[i]))
			}	
		}
		}
		await db.editStudentById(studentId, request.body);
		await module.exports.viewStudentPage(request, response)
	},

	deleteStudent: async function (request, response) {
		let studentId = request.params.id
		let studentObj = await db.getStudentById(studentId)
		let applicationList = await application_db.getApplicationsList()
		for(let i = 0; i < applicationList.length; i++) {
			if(applicationList[i].student == studentId) {
				applicationList[i].status == 'disabled'
			}
		}
		studentObj['status'] = 'inactive'
		await db.editStudentById(studentId, studentObj)

		response.redirect('/')
	},

	reactivateStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);
		let applicationList = await application_db.getApplicationsList();
		for(let i = 0; i < applicationList.length; i++) {
			if(applicationList[i].student == studentId) {
				applicationList[i].status == 'reinstated'
			}
		}
		studentObj['status'] = 'active';
		await db.editStudentById(studentId, studentObj)

		response.redirect('/');
	},
	activePrograms: function(programList) {
		let activePrograms = [];
		for (let i = 0; i < programList.length; i++) {
			if (programList[i].status == "active") {
				activePrograms.push(programList[i])
			}
		}
		return activePrograms
	},
	

	increaseStudentGrades: async function (request, response) {
		let grades = ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "College Freshman", "College Sophmore", "College Junior", "College Senior", "Out of School"];
		let students = await db.getStudentsList();

		for (let i = 0; i < students.length; i++) {
			let currentGradeIndex = grades.indexOf(students[i].grade);
			if (currentGradeIndex < grades.length) { //Won't increment if out of school
				let studentObj = students[i];
				studentObj['grade'] = grades[currentGradeIndex + 1];
				await db.editStudentById(studentObj.id, studentObj);
			}
		}

		response.redirect('/');
	}
};
