const db = require("../database/db");
const jwt = require('jsonwebtoken');
const userDb = require("../auth/models");
const User = userDb.user;
const config = require('../auth/config/auth.config');

module.exports = {
	getHomePage: async function (request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}
		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let token = request.headers['cookie'].substring(6);
		jwt.verify(token, config.secret, (err, decoded) => {
			console.log(':)');
			if (err) {
				console.log(':(');
			  return res.redirect('/api/auth/signin');
			}
			let user = User.findById(decoded.id).exec((err, user) => {
				console.log(decoded.id)
				if (user.userType == 'admin') {
					let renderData = {
						path: 'none',
						students: activeStudents,
						isAdmin: true,
						isStudent: false
					}
			
					return response.render('index', renderData);
				} else if (user.userType == 'student') {
					let renderData = {
						path: 'none',
						students: activeStudents,
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId
					}
			
					return response.render('index', renderData);
				} else {
					let renderData = {
						path: 'none',
						student: activeStudents,
						isAdmin: false,
						isStudent: false
					}
				}
			});
		});
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents
		}
		
		response.render('index', renderData);
	},

	filter: async function (request, response) {
		let studentList = await db.getStudentsList();
		let filteredGrade = request.params.grade;

		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		let filteredStudents = [];
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i]);
			}
		}

		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents
		}

		response.render('index', renderData);
	}
};
