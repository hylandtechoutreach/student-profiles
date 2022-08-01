const Program = require("../models/Program");
const application_db = require("../database/application_db")
const grades = ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Out of High School", "College Freshman", "College Sophmore", "College Junior", "College Senior", "Out of College"];

module.exports = {
	addProgram: async function(programObj) {
    if (grades.indexOf(programObj.min_grade_level) <= grades.indexOf(programObj.max_grade_level)) {
      const newProgram = new Program({
        title: programObj.title,
        description: programObj.description,
        location: programObj.location,
        start_date: programObj.start_date,
        end_date: programObj.end_date,
        min_grade_level: programObj.min_grade_level,
        max_grade_level: programObj.max_grade_level,
        program_id: `${programObj.title}.${ await module.exports.getTitleCount(programObj.title)}`,
        status: "active"
      });
      await newProgram.save()

      let student_list = programObj.student_list
      for(let i = 0; i < student_list.length; i++) {
        application_db.addApplication(student_list[i], newProgram.id)
      }

    }
	},
  getTitleCount: async function(currentTitle) {
	  return await Program.find({title : currentTitle}).countDocuments() + 1 
	},
  
	getProgramsList: async function() {
	  return await Program.find({});
	},

	getProgramById: async function(programId) {
    return await Program.findOne({
      _id: programId
    })
	},

	editProgramById: async function(programId, newprogramObj) {
    if (grades.indexOf(newprogramObj.min_grade_level) <= grades.indexOf(newprogramObj.max_grade_level)) {
      await Program.findOneAndUpdate({
        _id: programId
      },
      newprogramObj,
      {
        runValidators: true
      });
    }
	},
}