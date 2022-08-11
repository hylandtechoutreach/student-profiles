const db = require("../database/program_db")
const student_db = require("../database/db")
const moment = require('moment');
const registration_db = require("../database/registration_db")
const registrationFile = require("./registration")
var mongoose = require('mongoose');
const registration = require("./registration");
const constants = require("./constants")

module.exports = {
	addProgramPage: async function (request, response) {
		let activeStudents = module.exports.activeStudents(await student_db.getStudentsList())

		let eligibleList = [];
		let grades = constants.getGradeLevels()
		for (let i = 0; i < activeStudents.length; i++) {
			let eligible = true;
			let studentGrade = grades.indexOf(activeSTudents[i].grade), minGrade = grades.indexOf(programObj['min_grade_level']), maxGrade = grades.indexOf(programObj['max_grade_level'])

			if (studentGrade < minGrade || studentGrade > maxGrade) { eligible = false }
			eligibleList.push(eligible)
		}

		let renderData = {
			program: {},
			students: activeStudents,
			add: true,
			view: false,
			grades: grades,
			eligibleList: eligibleList,

		}

		response.render('edit-program', renderData)
	},

	editProgramPage: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let activeStudents = module.exports.activeStudents(await student_db.getStudentsList())

		startDate = moment(programObj.start_date);
		endDate = moment(programObj.end_date);

		programObj['start_date_formatted'] = startDate.format('YYYY[-]MM[-]DD[T]hh:mm');
		programObj['end_date_formatted'] = endDate.format('YYYY[-]MM[-]DD[T]hh:mm');

		let eligibleList = [];
		let grades = constants.getGradeLevels()
		for (let i = 0; i < activeStudents.length; i++) {
			let eligible = true;
			let studentGrade = grades.indexOf(activeStudents[i].grade), minGrade = grades.indexOf(programObj['min_grade_level']), maxGrade = grades.indexOf(programObj['max_grade_level'])

			if (studentGrade < minGrade || studentGrade > maxGrade) { eligible = false }
			eligibleList.push(eligible)
		}

		let renderData = {
			program: programObj,
			students: activeStudents,
			registrations: await registrationFile.activeRegistrations(),
			add: false,
			view: false,
			grades: grades,
			eligibleList: eligibleList,
		};

		response.render('edit-program', renderData);
	},
	viewProgramPage: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let studentList = await student_db.getStudentsList();

		startDate = moment(programObj.start_date);
		endDate = moment(programObj.end_date);

		programObj['start_date_formatted'] = startDate.format('YYYY[-]MM[-]DD[T]hh:mm');
		programObj['end_date_formatted'] = endDate.format('YYYY[-]MM[-]DD[T]hh:mm');

		let renderData = {
			program: programObj,
			add: false,
			view: true,
			students: await registrationFile.getStudentListByProgramId(programId),
			registrations: await registrationFile.activeRegistrations(),
			grades: constants.getGradeLevels(),
			eligibleList: "",
		}

		response.render('edit-program', renderData);
	},

	addProgram: async function (request, response) {
		await db.addProgram(request.body)

		response.redirect('/program')
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
		await db.editProgramById(programId, request.body);
		await module.exports.viewProgramPage(request, response);
	},

	deleteProgram: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let registrationList = await registration_db.getRegistrationsList()
		for (let i = 0; i < registrationList.length; i++) {
			if (registrationList[i].program == programId) {
				registrationList[i]['status'] = 'disabled'
				await registration_db.editRegistrationById(registrationList[i].id, registrationList[i])
			}
		}
		programObj['status'] = 'inactive'
		await db.editProgramById(programId, programObj)

		response.redirect('/program')
	},

	reactivateProgram: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let registrationList = await registration_db.getRegistrationsList();
		for (let i = 0; i < registrationList.length; i++) {
			if (registrationList[i].program == programId) {
				registrationList[i]['status'] = 'active'
				await registration_db.editRegistrationById(registrationList[i].id, registrationList[i])
			}
		}
		programObj['status'] = 'active'
		await db.editProgramById(programId, programObj)

		response.redirect('/program')
	},
	activeStudents: function (studentList) {
		let activeStudents = []
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}
		return activeStudents
	},

};
