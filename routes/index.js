const jwt = require('jsonwebtoken');
const userDb = require("../auth/models");
const User = userDb.user;
const config = require('../auth/config/auth.config');
const db = require("../database/db")
const programFile = require("./program")
const applicationFile = require("./application")
const program_db = require("../database/program_db")

module.exports = {
	getHomePage: async function (request, response) {
		let activeStudents = programFile.activeStudents(await db.getStudentsList()) 
		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));
		let activeApplications = await applicationFile.activeApplications()
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].student == activeStudents[i].id) { 
					let programObj =  await program_db.getProgramById(activeApplications[j].program)
					programTitles.push(programObj.title)
				} 
			} 
		}
		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		//Want to make this a separate function for better organization
		let token = request.headers['cookie'];

		if (!token) {
			let renderData = {
				message: ""
			  }
			return res.render('signin', renderData)
		}

		token = token.substring(6);
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				let renderData = {
					message: ""
				  }
				return res.render('signin', renderData)
			}
			let user = User.findById(decoded.id).exec((err, user) => {
				if (user.userType == 'admin') {
					let renderData = {
						path: 'none',
						students: activeStudents,
						isAdmin: true,
						isStudent: false,
						applications: activeApplications,
						titles: programTitles,
					}
			
					return response.render('index', renderData);
				} else if (user.userType == 'student') {
					let renderData = {
						path: 'none',
						students: activeStudents,
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId,
						applications: activeApplications,
						titles: programTitles,
					}
			
					return response.render('index', renderData);
				} else {
					let renderData = {
						path: 'none',
						students: activeStudents,
						isAdmin: false,
						isStudent: false,
						applications: activeApplications,
						titles: programTitles,
					}

					response.render('index', renderData);
				}
			});
		});
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = programFile.activeStudents(studentList) 
		let activeApplications = await applicationFile.activeApplications()
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].student == activeStudents[i].id) { 
					let programObj =  await program_db.getProgramById(activeApplications[j].program)
					programTitles.push(programObj.title)
				} 
			} 
		}

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents,
			applications: applicationFile.activeApplications(),
			titles: programTitles,
		}
		
		response.render('index', renderData)
	},

	filter: async function (request, response) {
		let studentList = await db.getStudentsList();
		let filteredGrade = request.params.grade;

		let activeStudents = programFile.activeStudents(studentList) 

		let filteredStudents = []
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i])
			}
		}
		let activeApplications = await applicationFile.activeApplications()
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].student == activeStudents[i].id) { 
					let programObj =  await program_db.getProgramById(activeApplications[j].program)
					programTitles.push(programObj.title)
				} 
			} 
		}
		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents,
			applications: applicationFile.activeApplications(),
			titles: programTitles,
		}

		//Want to make this a separate function for better organization
		let token = request.headers['cookie'];

		if (!token) {
			let renderData = {
				message: ""
			  }
			return res.render('signin', renderData)
		}

		token = token.substring(6);
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				let renderData = {
					message: ""
				  }
				return res.render('signin', renderData)
			}
			let user = User.findById(decoded.id).exec((err, user) => {
				if (user.userType == 'admin') {
					let renderData = {
						path: filteredGrade,
						students: filteredStudents,
						isAdmin: true,
						isStudent: false,
						applications: applicationFile.activeApplications(),
						titles: programTitles,
					}
			
					return response.render('index', renderData);
				} else if (user.userType == 'student') {
					let renderData = {
						path: filteredGrade,
						students: filteredStudents,
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId,
						applications: applicationFile.activeApplications(),
						titles: programTitles,
					}
			
					return response.render('index', renderData);
				} else {
					let renderData = {
						path: filteredGrade,
						students: filteredStudents,
						isAdmin: false,
						isStudent: false,
						applications: applicationFile.activeApplications(),
						titles: programTitles,
					}

					response.render('index', renderData);
				}
			});
		});
	}
};
