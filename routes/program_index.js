const db = require("../database/program_db")
const studentFile = require("./student")
const application_db = require("../database/application_db")
const applicationFile = require("./application")
const student_db = require("../database/db")
const moment = require('moment');
const jwt = require('jsonwebtoken');
const userDb = require("../auth/models");
const User = userDb.user;
const config = require('../auth/config/auth.config');

module.exports = {
	getProgramPage: async function (request, response) {
		let programList = await db.getProgramsList()
		let activePrograms = studentFile.activePrograms(programList)
		let activeApplications = await applicationFile.activeApplications()
		let studentNames = []
		for (let i = 0; i < activePrograms.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].program == activePrograms[i].id) { 
					let studentObj =  await student_db.getStudentById(activeApplications[j].student)
					studentNames.push(studentObj.first_name)
				} 
			} 
		}

		for (let i = 0; i < activePrograms.length; i++) {
			startDate = moment(activePrograms[i].start_date);
			endDate = moment(activePrograms[i].end_date);

			activePrograms[i]['start_date_formatted'] = startDate.format('MMM Do YYYY, h:mma');
			activePrograms[i]['end_date_formatted'] = endDate.format('MMM Do YYYY, h:mma');
		}

		let renderData = {
			programs: activePrograms,
			applications: activeApplications,
			first_names: studentNames,
		}
		let token = request.headers['cookie']

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
						programs: activePrograms,
						isAdmin: true,
						isStudent: false,
						applications: activeApplications,
						first_names: studentNames,
					}
			
					return response.render('program_index', renderData);
				} else if (user.userType == 'student') {
					let renderData = {
						path: 'none',
						programs: activePrograms,
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId,
						applications: activeApplications,
						first_names: studentNames,
					}
			
					return response.render('program_index', renderData);
				} else {
					let renderData = {
						path: 'none',
						programs: activePrograms,
						isAdmin: false,
						isStudent: false,
						applications: activeApplications,
						first_names: studentNames,
					}
					response.render('program_index', renderData);
				}
			});
		});
		
	},
	
};