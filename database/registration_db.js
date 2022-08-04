const Registration = require("../models/Registration")
module.exports = {
    getRegistrationsList: async function() {
        return await Registration.find({})
    },
    editRegistrationById: async function(registrationId, newRegistrationObj) {
        await Registration.findOneAndUpdate({
          _id: registrationId
        },
        newRegistrationObj,
        {
          runValidators: true
        })
        },
        getRegistrationById: async function(registrationId) {
            return await Registration.findOne({
              _id: registrationId
            })
        },
        deleteRegistrationByStudentId: async function(studentId) {
          await Registration.deleteMany({ student: studentId })
        },
        deleteRegistrationByProgramId: async function(programId) {
          await Registration.deleteMany({ program: programId })
        },
        addRegistration: async function(studentId, programId) {
          const newRegistration = new Registration({ 
            student: studentId,
            program: programId,
            status: "new",
          })
          await newRegistration.save()
        },
        getActiveRegistrations: async function() {
          return await Registration.find({status: 'active'});
      }
}