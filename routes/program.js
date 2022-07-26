const db = require("../database/program_db")
const student_db = require("../database/db")
module.exports = {
	addProgramPage: function (request, response) {
		let renderData = {
			program: {},
			add: true
		};

		response.render('edit-program', renderData);
	},

	addProgram: async function (request, response) {
		await db.addProgram(request.body);

		response.redirect('/program')
	},

	editProgramPage: async function (request, response) {
		let programId = request.params.id;
		let programObj = await db.getProgramById(programId);
		let studentList = await student_db.getStudentsList();

		let renderData = {
			program: programObj,
			students: studentList,
			add: false
		};

		response.render('edit-program', renderData);
	},

	editProgram: async function (request, response) {
		let programId = request.params.id;
		await db.editProgramById(programId, request.body);

		response.redirect('/program');
	},

	deleteProgram: async function (request, response) {
		let programId = request.params.id;
		let programObj = await db.getProgramById(programId);

		programObj['status'] = 'inactive';
		await db.editProgramById(programId, programObj);

		response.redirect('/program');
	},

	reactivateProgram: async function (request, response) {
		let programId = request.params.id;
		let programObj = await db.getProgramById(programId);

		programObj['status'] = 'active';
		await db.editProgramById(programId, programObj);

		response.redirect('/program');
	},
};