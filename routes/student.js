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

	editStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = request.body;

		if (studentObj.img == '') {
			let student = await db.getStudentById(studentId);
			studentObj['img'] = student.img;
		}
		
		await db.editStudentById(studentId, studentObj);

		response.redirect('/');
	},

	deleteStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		studentObj['status'] = 'inactive';
		await db.editStudentById(studentId, studentObj);

		response.redirect('/');
	},

	reactivateStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		studentObj['status'] = 'active';
		await db.editStudentById(studentId, studentObj);

		response.redirect('/');
	}
};