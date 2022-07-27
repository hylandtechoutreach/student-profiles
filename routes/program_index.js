const db = require("../database/program_db");
const jwt = require('jsonwebtoken');
const userDb = require("../auth/models");
const User = userDb.user;
const config = require('../auth/config/auth.config');

module.exports = {
	getProgramPage: async function (request, response) {
		let programList = await db.getProgramsList();
		let activePrograms = [];
		for (let i = 0; i < programList.length; i++) {
			if (programList[i].status == "active") {
				activePrograms.push(programList[i]);
			}
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
						isStudent: false
					}
			
					return response.render('program_index', renderData);
				} else if (user.userType == 'student') {
					let renderData = {
						path: 'none',
						programs: activePrograms,
						isAdmin: false,
						isStudent: true,
						studentId: user.studentId
					}
			
					return response.render('program_index', renderData);
				} else {
					let renderData = {
						path: 'none',
						programs: activePrograms,
						isAdmin: false,
						isStudent: false
					}
					response.render('program_index', renderData);
				}
			});
		});
		
	},
	
};