const Application = require("../models/Application");
module.exports = {
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
            });
        },
        deleteApplicationByStudentId: async function(studentId) {
          await Application.deleteMany({ student: studentId })
          // await Application.findOneAndRemove({
          //   student: studentId
          // });
        },
        deleteApplicationByProgramId: async function(programId) {
          await Application.deleteMany({ program: programId })

          // await Application.findOneAndRemove({
            // program: programId
          // });
        },
        addApplication: async function(studentId, programId) {
          const newApplication = new Application({ 
            student: studentId,
            program: programId,
            status: "new",
          })
          await newApplication.save();
        },
}