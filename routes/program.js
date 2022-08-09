const db = require("../database/program_db")
const student_db = require("../database/db")
const moment = require('moment');
const application_db = require("../database/application_db")
const applicationFile = require("./application")
var mongoose = require('mongoose');
module.exports = {
	addProgramPage: async function (request, response) {
		let studentList = await student_db.getStudentsList()
		let renderData = {
			program: {},
			students: await module.exports.activeStudents(studentList),
			add: true,
			view: false,
			applications: await applicationFile.activeApplications(),
		}

		response.render('edit-program', renderData)
	},

	editProgramPage: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let studentList = await student_db.getStudentsList()
		
		startDate = moment(programObj.start_date);
		endDate = moment(programObj.end_date);

		programObj['start_date_formatted'] = startDate.format('YYYY[-]MM[-]DD[T]hh:mm');
		programObj['end_date_formatted'] = endDate.format('YYYY[-]MM[-]DD[T]hh:mm');

		let renderData = {
			program: programObj,
			students: await module.exports.activeStudents(studentList),
			applications: await applicationFile.activeApplications(),
			add: false,
			view: false
		};

		response.render('edit-program', renderData);
	},

	addProgram: async function (request, response) {
		await db.addProgram(request.body)

		response.redirect('/program')
	},

	editProgram: async function (request, response) {
		let programId = request.params.id
		let studentIds = []
		await application_db.deleteApplicationByProgramId(programId)

		if(request.body.student_list !== undefined) {
		for(let i = 0; i < request.body.student_list.length; i++) {
			studentIds.push(request.body.student_list[i])
		}
		if(request.body.student_list.length == 24) {
			await application_db.addApplication(mongoose.Types.ObjectId(request.body.student_list), programId)
		}
		else {
			for(let i = 0; i < request.body.student_list.length; i++) {
				await application_db.addApplication(mongoose.Types.ObjectId(studentIds[i]), programId)
			}
		}
	}
		await db.editProgramById(programId, request.body)
		await module.exports.viewProgramPage(request, response)
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
			students: await applicationFile.getStudentListByProgramId(programId),
			applications: await applicationFile.activeApplications(),
		}

		response.render('edit-program', renderData);
	},

	deleteProgram: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let applicationList = await application_db.getApplicationsList()
		for(let i = 0; i < applicationList.length; i++) {
			if(applicationList[i].program == programId) {
				applicationList[i].status == 'disabled'
			}
		}
		programObj['status'] = 'inactive'
		await db.editProgramById(programId, programObj)

		response.redirect('/program')
	},

	reactivateProgram: async function (request, response) {
		let programId = request.params.id
		let programObj = await db.getProgramById(programId)
		let applicationList = await application_db.getApplicationsList();
		for(let i = 0; i < applicationList.length; i++) {
			if(applicationList[i].program == programId) {
				applicationList[i].status == 'new'
			}
		}
		programObj['status'] = 'active'
		await db.editProgramById(programId, programObj)

		response.redirect('/program')
	},
	activeStudents: function(studentList) {
		let activeStudents = []
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}
		return activeStudents
	},
	
};
