const db = require("../database/program_db")
const studentFile = require("./student")
const application_db = require("../database/application_db")
const applicationFile = require("./application")
const student_db = require("../database/db")

module.exports = {
	getProgramPage: async function (request, response) {
		let programList = await db.getProgramsList()
		let activePrograms = studentFile.activePrograms(programList)
		let activeApplications = await applicationFile.activeApplications()
		let studentNames = []
		for (let i = 0; i < activePrograms.length; i++) {
			for (let j = 0; j < activeApplications.length; j++) { 
				if (activeApplications[j].program == activePrograms[i].id) { 
					let studentObj =  await student_db.getStudentById(activeApplications[j].student)
					studentNames.push(studentObj.first_name)
				} 
			} 
		}
		let renderData = {
			programs: activePrograms,
			applications: activeApplications,
			first_names: studentNames,
		}
		response.render('program_index', renderData)

	},
	
};