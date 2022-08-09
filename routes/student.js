const student_db = require("../database/db");
const program_db = require("../database/program_db");
const registration_db = require("../database/registration_db");
const constants = require("./constants");
const registrationFile = require("./registration");
var mongoose = require('mongoose');
const moment = require('moment');
const countries = require("countries-list").countries;

module.exports = {
	addStudentPage: async function (request, response) {
		let programList = await module.exports.activePrograms();
		let renderData = {
			student: {},
			programs: programList,
			registrations: await registrationFile.activeRegistrations(),
			add: true,
			view: false,
			countries: countries,
			grades: constants.getGradeLevels(),
			formatedProgramList: module.exports.getFormatedProgramList(programList),

		}

		response.render('edit-student', renderData);
	},

	editStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await student_db.getStudentById(studentId);
		let programList = await module.exports.activePrograms();
		let registrationList = await registrationFile.activeRegistrations();

		let dateOfBirth = moment.utc(studentObj.dateOfBirth);
		studentObj['dateOfBirthFormatted'] = dateOfBirth.format('YYYY[-]MM[-]DD');
		
		let renderData = {
			student: studentObj,
			programs: programList,
			registrations: registrationList,
			view: false,
			add: false,
			countries: countries,
			grades: constants.getGradeLevels(),
			formatedProgramList: module.exports.getFormatedProgramList(programList),
		};
		response.render('edit-student', renderData);
	},

	viewStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await student_db.getStudentById(studentId);
		let programList = await registrationFile.getProgramListByStudentId(studentId);

		let dateOfBirth = moment.utc(studentObj.dateOfBirth);
		studentObj['dateOfBirthFormatted'] = dateOfBirth.format('YYYY[-]MM[-]DD');
		
		let renderData = {
			student: studentObj,
			programs: programList,
			registrations: await registrationFile.activeRegistrations(),
			add: false,
			view: true,
			countries: countries,
			grades: constants.getGradeLevels(),
			formatedProgramList: module.exports.getFormatedProgramList(programList),

		};

		response.render('edit-student', renderData);
	},

	addStudent: async function (request, response) {
		await student_db.addStudent(request.body);
		response.redirect('/');
	},
	
	editStudent: async function (request, response) {
		let studentId = request.params.id;
		await registration_db.deleteRegistrationByStudentId(studentId);
		let program_list = request.body.program_list;
		if(program_list !== undefined) {
			if(program_list instanceof Array) {
				for(let i = 0; i < program_list.length; i++) {
					await registration_db.addRegistration(studentId, mongoose.Types.ObjectId(program_list[i]));
				}	
			} else {
				await registration_db.addRegistration(studentId, mongoose.Types.ObjectId(program_list));
			}
		}
		await student_db.editStudentById(studentId, request.body);
		await module.exports.viewStudentPage(request, response);
	},

	deleteStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await student_db.getStudentById(studentId);
		let registrationList = await registration_db.getRegistrationsList();
		for(let i = 0; i < registrationList.length; i++) {
			if(registrationList[i].student == studentId) {
				registrationList[i]['status'] = 'disabled';
				await registration_db.editRegistrationById(registrationList[i].id,registrationList[i]);
			}
		}
		studentObj['status'] = 'inactive';
		await student_db.editStudentById(studentId, studentObj);

		response.redirect('/');
	},

	reactivateStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await student_db.getStudentById(studentId);
		let registrationList = await registration_db.getRegistrationsList();
		for(let i = 0; i < registrationList.length; i++) {
			if(registrationList[i].student == studentId) {
				registrationList[i]['status'] = 'active';
				await registration_db.editRegistrationById(registrationList[i].id,registrationList[i]);
			}
		}
		studentObj['status'] = 'active';
		await student_db.editStudentById(studentId, studentObj);

		response.redirect('/');
	},

	increaseStudentGrades: async function (request, response) {
		let grades = constants.getGradeLevels()
		let students = await student_db.getStudentsList();

		for (let i = 0; i < students.length; i++) {
			let currentGradeIndex = grades.indexOf(students[i].grade);
			if (currentGradeIndex < grades.length) { //Won't increment if out of school
				let studentObj = students[i];
				studentObj['grade'] = grades[currentGradeIndex + 1];
				await student_db.editStudentById(studentObj.id, studentObj);
			}
		}

		response.redirect('/');
	},
	// Returns list of program titles with formated start dates
	getFormatedProgramList:  function (programList) {
		let formatedProgramList = [];
		for (let i = 0; i < programList.length; i++) { 
			let startDate = moment.utc(programList[i].start_date);
			let shortMonth = new Date(startDate).toLocaleString('en-us', { month: 'short' });
			let year = startDate.format('YYYY');
			formatedProgramList.push(`${programList[i].title} (${shortMonth} ${year})`);
 		} 

		return formatedProgramList;

	},

	activePrograms: async function() {
		return await program_db.getProgramsByParams({status: 'active'});
	},
};
