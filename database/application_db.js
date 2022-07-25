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
            });
        },
}