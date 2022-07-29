const application_db = require("../database/application_db")
const student_db = require("../database/db")
const program_db = require("../database/program_db")

module.exports = {
    getApplicationsByStudentId: async function(studentId) {
        let applicationList = await application_db.getApplicationsList();
        let program_list = []
        for(let i = 0; i < applicationList.length; i++) {
            if(applicationList[i].student == studentId) {
                program_list.push(await program_db.getProgramById(applicationList[i].program))
            }
        }
        return program_list
    },
    getApplicationsByProgramId: async function(programId) {
        let applicationList = await application_db.getApplicationsList();
        let student_list = []
        for(let i = 0; i < applicationList.length; i++) {
            if(applicationList[i].program == programId) {
                student_list.push(await student_db.getStudentById(applicationList[i].student))
            }
        }
        return student_list
    },
    activeApplications: async function() {
		let applicationList = await application_db.getApplicationsList()
		let activeApplications = [];
		for (let i = 0; i < applicationList.length; i++) {
			if (applicationList[i].status != "disabled") {
				activeApplications.push(applicationList[i]);
			}
		}
		return activeApplications
	}, 
}