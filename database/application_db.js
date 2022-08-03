const Application = require("../models/Application");
module.exports = {
	addApplication: async function(studentObj, programObj) {
        const newApplication = new Application({
            student: studentObj, 
            program: programObj,
            status: "new",
        })

      await newApplication.save()
    },

    getApplicationsList: async function() {
        return await Application.find({});
    },
    editApplicationById: async function(applicationId, newApplicationObj) {
        await Application.findOneAndUpdate({
          _id: applicationId
        },
        newApplicationObj,
        {
          runValidators: true
        });
        },
        getApplicationById: async function(applicationId) {
            return await Application.findOne({
              _id: applicationId
            })
        },
        deleteApplicationByStudentId: async function(studentId) {
          await Application.deleteMany({ student: studentId })
        },
        deleteApplicationByProgramId: async function(programId) {
          await Application.deleteMany({ program: programId })
        },
        addApplication: async function(studentId, programId) {
          const newApplication = new Application({ 
            student: studentId,
            program: programId,
            status: "new",
          })
          await newApplication.save()
        },
}