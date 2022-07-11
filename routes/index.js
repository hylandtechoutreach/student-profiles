const db = require("../db");

module.exports = {
	getHomePage: async function (request, response) {
		let studentList = await db.getStudentsList();
		let result = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				result.push(studentList[i]);
			}
		}

		let renderData = {
			path: 'none',
			students: result
		}

		response.render('index', renderData);
		
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
		let array = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].grade == filteredGrade) {
				array.push(studentList[i]);
			}
		}

		let renderData = {
			path: filteredGrade,
			students: array
		}

		response.render('index', renderData);
	}
};