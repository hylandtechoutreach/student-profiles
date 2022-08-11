const db = require("../database/db")
const jwt = require('jsonwebtoken')
const userDb = require("../auth/models")
const User = userDb.user
const config = require('../auth/config/auth.config')
const programFile = require("./program")
const registrationFile = require("./registration")
const program_db = require("../database/program_db")
const constants = require("./constants")
const registration_db = require("../database/registration_db")

module.exports = {
	getHomePage: async function (request, response) {
		let activeStudents = programFile.activeStudents(await db.getStudentsList()) 
		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));
		let activeRegistrations = await registrationFile.activeRegistrations()
		
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
			let user = User.findById(decoded.id).exec(async (err, user) => {
				if (user.userType == 'admin') {
					let titles = await getProgramTitles(activeStudents, activeRegistrations);
					let renderData = {
						path: 'none',
						students: activeStudents,
						registrations: activeRegistrations,
						titles: titles,
						grades: constants.getGradeLevels(),
						isAdmin: true,
						isStudent: false,
					}
			
					return response.render('index', renderData);
				} else if (user.userType == 'student') {
					let titles = await getProgramTitles(activeStudents, activeRegistrations);
					let renderData = {
						path: 'none',
						students: activeStudents,
						registrations: activeRegistrations,
						titles: titles,
						grades: constants.getGradeLevels(),
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId,
					}
			
					return response.render('index', renderData);
				} else {
					let titles = await getProgramTitles(activeStudents, activeRegistrations);
					let renderData = {
						path: 'none',
						students: activeStudents,
						registrations: activeRegistrations,
						titles: titles,
						grades: constants.getGradeLevels(),
						isAdmin: false,
						isStudent: false,
					}

					response.render('index', renderData);
				}
			});
		});
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = programFile.activeStudents(studentList) 
		let activeRegistrations = await registrationFile.activeRegistrations()

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents,
			registrations: registrationFile.activeRegistrations(),
			titles: await getProgramTitles(activeStudents, activeRegistrations),
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
		let activeRegistrations = await registrationFile.activeRegistrations()

		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents,
			registrations: registrationFile.activeRegistrations(),
			titles: await getProgramTitles(activeStudents, activeRegistrations),
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
		jwt.verify(token, config.secret, async (err, decoded) => {
			if (err) {
				let renderData = {
					message: ""
				  }
				return res.render('signin', renderData)
			}
			let user = User.findById(decoded.id).exec(async (err, user) => {
				if (user.userType == 'admin') {
					let titles = await getProgramTitles(activeStudents, activeRegistrations);
					let renderData = {
						path: filteredGrade,
						students: filteredStudents,
						registrations: registrationFile.activeRegistrations(),
						grades: constants.getGradeLevels(),
						titles: titles,
						isAdmin: true,
						isStudent: false,
					}
			
					return response.render('index', renderData);
				} else if (user.userType == 'student') {
					let titles = await getProgramTitles(activeStudents, activeRegistrations);
					let renderData = {
						path: filteredGrade,
						students: filteredStudents,
						registrations: registrationFile.activeRegistrations(),
						grades: constants.getGradeLevels(),
						titles: titles,
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId,
					}
			
					return response.render('index', renderData);
				} else {
					let titles = await getProgramTitles(activeStudents, activeRegistrations);
					let renderData = {
						path: filteredGrade,
						students: filteredStudents,
						registrations: registrationFile.activeRegistrations(),
						grades: constants.getGradeLevels(),
						titles: titles,
						isAdmin: false,
						isStudent: false,
					}

					response.render('index', renderData);
				}
			});
		});
	},

	getProgramTitles: async function(activeStudents, activeRegistrations) {
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			let registrations = await registration_db.getRegistrationsByParams({
				status: 'active',
				student: activeStudents[i].id
			})

			for (let j = 0; j < registrations.length; j++) {
				let programObj = await program_db.getProgramById(registrations[j].program)
				programTitles.push(programObj.title)
			}
		}
		return programTitles
	},
};
