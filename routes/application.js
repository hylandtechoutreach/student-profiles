const program_db = require("../database/program_db")
const student_db = require("../database/db")
const application_db = require("../database/application_db")

module.exports = {
    addApplication: async function (request, response) {
        let studentId = request.params.id
        let programId = request.params.program_id
        let studentObj = await student_db.getStudentById(studentId)
        let programObj = await program_db.getProgramById(programId)
        await application_db.addApplication(studentObj, programObj)

        response.redirect('/program')
            
    },
    getApplications: async function (request, response) {
        let status = {
            'new': 1,
            'accept': 2,
            'deny': 3,
        }
        let applicationList = await application_db.getApplicationsList()
        applicationList.sort((a, b) => status[a.status] - status[b.status])
        let renderData = {
            applications: applicationList,
        }

        return response.render('applications', renderData)
    },
    acceptApplication: async function (request, response) {
		let applicationId = request.params.id
		let applicationObj = await application_db.getApplicationById(applicationId)
		applicationObj['status'] = 'accept'
		await application_db.editApplicationById(applicationId, applicationObj)

        // let studentObj = applicationObj['student']
        // let programObj = applicationObj['program']
        // studentObj.program_list.push(programObj)
        // programObj.student_list.push(studentObj)
        // await program_db.editProgramById(programObj.id, programObj)
        // await student_db.editStudentById(studentObj.id, studentObj)

		response.redirect('/applications')
	},
    denyApplication: async function (request, response) {
		let applicationId = request.params.id
		let applicationObj = await application_db.getApplicationById(applicationId)
		applicationObj['status'] = 'deny'
		await application_db.editApplicationById(applicationId, applicationObj)

		response.redirect('/applications')
	},
}