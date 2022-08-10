const programFile = require("./program")
const registrationFile = require("./registration")
const program_db = require("../database/program_db")
const constants = require("./constants")
const registration_db = require("../database/registration_db")

module.exports = {
	getHomePage: async function (request, response) {
		let activeStudents = await programFile.activeStudents();
		activeStudents.sort((a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));

		activeStudents.sort((a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents,
			registrations: await registrationFile.activeRegistrations(),
			titles: await module.exports.getProgramTitles(activeStudents),
			grades: constants.getGradeLevels(),
		};

		response.render('index', renderData);

	},

	sortFirstNames: async function (request, response) {
		let activeStudents = await programFile.activeStudents();

		activeStudents.sort((a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents,
			registrations: registrationFile.activeRegistrations(),
			titles: await module.exports.getProgramTitles(activeStudents),
		};

		response.render('index', renderData);
	},

	filter: async function (request, response) {
		let filteredGrade = request.params.grade;
		let activeStudents = await programFile.activeStudents();

		let filteredStudents = []
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i]);
			}
		}

		filteredStudents.sort((a, b) => a.first_name.localeCompare(b.first_name, 'en', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents,
			registrations: registrationFile.activeRegistrations(),
			titles: await module.exports.getProgramTitles(activeStudents),
		};

		response.render('index', renderData);
	},

	getProgramTitles: async function (activeStudents) {
		let programTitles = [];
		for (let i = 0; i < activeStudents.length; i++) {
			let registrations = await registration_db.getRegistrationsByParams({
				status: 'active',
				student: activeStudents[i].id,
			});

			for (let j = 0; j < registrations.length; j++) {
				let programObj = await program_db.getProgramById(registrations[j].program);
				programTitles.push(programObj.title);
			}
		}
		return programTitles;
	},
};
