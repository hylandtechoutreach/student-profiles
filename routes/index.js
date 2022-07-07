const db = require("../db");

module.exports = {
	getStudentPage: async function (request, response) {
		let studentList = await db.getStudentsList();
		let result = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				result.push(studentList[i]);
			}
		}

		let renderData = {
			students: result
		}

		response.render('student', renderData);
	},
	getHomePage: function (request, response) {
		response.render('index');
	},
};