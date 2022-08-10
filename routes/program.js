const program_db = require("../database/program_db");
const student_db = require("../database/db");
const registration_db = require("../database/registration_db");
const constants = require("./constants");
const registrationFile = require("./registration");
const moment = require('moment');
var mongoose = require('mongoose');

module.exports = {
	addProgramPage: async function (request, response) {
		let renderData = {
			program: {},
			students: await module.exports.activeStudents(),
			registrations: await registrationFile.activeRegistrations(),
			add: true,
			view: false,
			grades: constants.getGradeLevels(),
		}

		response.render('edit-program', renderData);
	},

	editProgramPage: async function (request, response) {
		let programId = request.params.id;
		let programObj = await program_db.getProgramById(programId);

		startDate = moment(programObj.start_date);
		endDate = moment(programObj.end_date);

		programObj['start_date_formatted'] = startDate.format('YYYY[-]MM[-]DD[T]hh:mm');
		programObj['end_date_formatted'] = endDate.format('YYYY[-]MM[-]DD[T]hh:mm');

		let renderData = {
			program: programObj,
			students: await module.exports.activeStudents(),
			registrations: await registrationFile.activeRegistrations(),
			add: false,
			view: false,
			grades: constants.getGradeLevels(),
		};

		response.render('edit-program', renderData);
	},

	viewProgramPage: async function (request, response) {
		let programId = request.params.id;
		let programObj = await program_db.getProgramById(programId);

		startDate = moment(programObj.start_date);
		endDate = moment(programObj.end_date);

		programObj['start_date_formatted'] = startDate.format('YYYY[-]MM[-]DD[T]hh:mm');
		programObj['end_date_formatted'] = endDate.format('YYYY[-]MM[-]DD[T]hh:mm');

		let renderData = {
			program: programObj,
			students: await registrationFile.getStudentListByProgramId(programId),
			registrations: await registrationFile.activeRegistrations(),
			add: false,
			view: true,
			grades: constants.getGradeLevels(),
		}

		response.render('edit-program', renderData);
	},

	addProgram: async function (request, response) {
		await program_db.addProgram(request.body);
		response.redirect('/program');
	},

	editProgram: async function (request, response) {
		let programId = request.params.id;
		await registration_db.deleteRegistrationByProgramId(programId);
		student_list = request.body.student_list;
		if (student_list !== undefined) {
			if (student_list instanceof Array) {
				for (let i = 0; i < student_list.length; i++) {
					await registration_db.addRegistration(mongoose.Types.ObjectId(student_list[i]), programId);
				}
			} else {
				await registration_db.addRegistration(mongoose.Types.ObjectId(student_list), programId);
			}
		}
		await program_db.editProgramById(programId, request.body);
		await module.exports.viewProgramPage(request, response);
	},

	deleteProgram: async function (request, response) {
		let programId = request.params.id;
		let programObj = await program_db.getProgramById(programId);
		let registrationList = await registration_db.getRegistrationsList();
		for (let i = 0; i < registrationList.length; i++) {
			if (registrationList[i].program == programId) {
				registrationList[i]['status'] = 'disabled';
				await registration_db.editRegistrationById(registrationList[i].id, registrationList[i]);
			}
		}
		programObj['status'] = 'inactive';
		await program_db.editProgramById(programId, programObj);

		response.redirect('/program');
	},

	reactivateProgram: async function (request, response) {
		let programId = request.params.id;
		let programObj = await program_db.getProgramById(programId);
		let registrationList = await registration_db.getRegistrationsList();
		for (let i = 0; i < registrationList.length; i++) {
			if (registrationList[i].program == programId) {
				registrationList[i]['status'] = 'active';
				await registration_db.editRegistrationById(registrationList[i].id, registrationList[i]);
			}
		}
		programObj['status'] = 'active';
		await program_db.editProgramById(programId, programObj);

		response.redirect('/program');
	},

	activeStudents: async function () {
		return await student_db.getStudentsByParams({ status: 'active' });
	},

};