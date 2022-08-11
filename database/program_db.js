const { validate } = require("../models/Program");
const Program = require("../models/Program");
const registration_db = require("./registration_db");
const constants = require("../routes/constants")
const grades = constants.getGradeLevels()
const d = new Date();

module.exports = {
	addProgram: async function(programObj) {
    if (validateProgram(programObj)) {

      const newProgram = new Program({
        title: programObj.title,
        description: programObj.description,
        location: programObj.location,
        start_date: programObj.start_date,
        end_date: programObj.end_date,
        min_grade_level: programObj.min_grade_level,
        max_grade_level: programObj.max_grade_level,
        isRegistrationRequired: !!programObj.isRegistrationRequired,
        program_id: `${programObj.title}.${ await module.exports.getTitleCount(programObj.title)}`,
        status: "active"
      });
      await newProgram.save()
      let student_list = programObj.student_list;
      if(student_list !== undefined) {
        if(student_list instanceof Array) {
          for(let i = 0; i < student_list.length; i++) {
            await registration_db.addRegistration(student_list[i], newProgram.id);
           }
        } else {
          await registration_db.addRegistration(student_list, newProgram.id);
        }
      }
    }
	},
  getTitleCount: async function(currentTitle) {
	  return await Program.find({title : currentTitle}).countDocuments() + 1 
	},
	getProgramsList: async function() {
	  return await Program.find({})
	},
	getProgramById: async function(programId) {
    return await Program.findOne({
      _id: programId
    })
	},
	editProgramById: async function(programId, newprogramObj) {
    if (validateProgram(newprogramObj)) {

      newprogramObj['isRegistrationRequired'] = !!newprogramObj.isRegistrationRequired;
      await Program.findOneAndUpdate({
        _id: programId
      },
      newprogramObj,
      {
        runValidators: true
      })
    }
	},
  getProgramsByParams: async function(params) {
    return await Program.find(params);
  },
}
function validateProgram(program) {
  if (!(grades.indexOf(program.min_grade_level) <= grades.indexOf(program.max_grade_level))) {
    return false;
  }
  if (!program.title || !program.description || !program.location || !program.start_date || !program.end_date || !program.min_grade_level || !program.max_grade_level) {
    return false;
  }
  return true;
}