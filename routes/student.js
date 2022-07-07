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

		response.redirect('/student')
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

	editStudent: async function (request, response) {
		let studentId = request.params.id;
		await db.editStudentById(studentId, request.body);

		response.redirect('/student');
	},

	deleteStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		studentObj['status'] = 'inactive';
		await db.editStudentById(studentId, studentObj);

		response.redirect('/student');
	},

	reactivateStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		studentObj['status'] = 'active';
		await db.editStudentById(studentId, studentObj);

		response.redirect('/student');
	}
};