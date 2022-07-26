const db = require("../database/program_db");

module.exports = {
	getProgramPage: async function (request, response) {
		let programList = await db.getProgramsList();
		let activeProgram = [];
		for (let i = 0; i < programList.length; i++) {
			if (programList[i].status == "active") {
				activeProgram.push(programList[i]);
			}
		}
		let renderData = {
			programs: activeProgram,
		}
		response.render('program_index', renderData);

	},
	
};