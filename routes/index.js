const db = require("../database/db")
const prorgam_db = require("../database/program_db")
const programFile = require("./program")
const applicationFile = require("./application");
const program_db = require("../database/program_db");

module.exports = {
	getHomePage: async function (request, response) {
		let studentList = await db.getStudentsList()
		let activeStudents = programFile.activeStudents(studentList) 
		let activeApplications = await applicationFile.activeApplications()
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].student == activeStudents[i].id) { 
					let programObj =  await program_db.getProgramById(activeApplications[j].program)
					programTitles.push(programObj.title)
				} 
			} 
		}
		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));
		
		let renderData = {
			path: 'none',
			students: activeStudents,
			applications: activeApplications,
			titles: programTitles,
		}

		response.render('index', renderData)
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}
		let activeApplications = await applicationFile.activeApplications()
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].student == activeStudents[i].id) { 
					let programObj =  await program_db.getProgramById(activeApplications[j].program)
					programTitles.push(programObj.title)
				} 
			} 
		}

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents,
			applications: applicationFile.activeApplications(),
			titles: programTitles,
		}
		
		response.render('index', renderData);
	},

	filter: async function (request, response) {
		let studentList = await db.getStudentsList();
		let filteredGrade = request.params.grade;

		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		let filteredStudents = [];
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i]);
			}
		}
		let activeApplications = await applicationFile.activeApplications()
		let programTitles = []
		for (let i = 0; i < activeStudents.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].student == activeStudents[i].id) { 
					let programObj =  await program_db.getProgramById(activeApplications[j].program)
					programTitles.push(programObj.title)
				} 
			} 
		}
		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents,
			applications: applicationFile.activeApplications(),
			titles: programTitles,
		}

		response.render('index', renderData);
	}
};
