const db = require("../db");

module.exports = {
	addStudentPage: function (request, response) {
		let renderData = {
			student: {},
			add: true
		};

		response.render('edit-student', renderData);
	},

	addStudent: async function (request, response) {
		await db.addStudent(request.body);

		response.redirect('/')
	},

	editStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		let renderData = {
			student: studentObj,
			add: false
		};

		response.render('edit-student', renderData);
	},
	getProfile: async function(request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);
		// await db.editstudentById(studentId, request.body);
		let renderData = new Object();
		renderData.student = studentObj;
		response.render('profile', renderData);
	},

	editStudent: async function (request, response) {
		let studentId = request.params.id;
		await db.editStudentById(studentId, request.body);

		response.redirect('/');
	},

	deleteStudent: async function (request, response) {
		let studentId = request.params.id;
		await db.deleteStudentById(studentId);

		response.redirect('/');
	}
};