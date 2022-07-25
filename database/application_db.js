const Application = require("../models/Application");
module.exports = {
	addApplication: async function(studentObj, programObj) {
        const newApplication = new Application({
            student: studentObj, 
            program: programObj,
        })

      await newApplication.save()
    },

    getApplicationsList: async function() {
        return await Application.find({});
    },
}