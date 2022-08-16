const registration_db = require("../database/registration_db")
const student_db = require("../database/db")
const program_db = require("../database/program_db")

module.exports = {
    getProgramListByStudentId: async function(studentId) {
        let registrationList = await module.exports.activeRegistrations();
        let program_list = []
        for(let i = 0; i < registrationList.length; i++) {
            if(registrationList[i].student == studentId) {
                program_list.push(await program_db.getProgramById(registrationList[i].program))
            }
        }
        return program_list
    },
    getStudentListByProgramId: async function(programId) {
        let registrationList = await module.exports.activeRegistrations();
        let student_list = []
        for(let i = 0; i < registrationList.length; i++) {
            if(registrationList[i].program == programId) {
                student_list.push(await student_db.getStudentById(registrationList[i].student))
            }
        }
        return student_list
    },
    activeRegistrations: async function() {
		return await registration_db.getActiveRegistrations()
	}, 
}