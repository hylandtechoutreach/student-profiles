const db = require("../database/program_db");
const moment = require('moment');

module.exports = {
	getProgramPage: async function (request, response) {
		let programList = await db.getProgramsList();
		let activeProgram = [];
		for (let i = 0; i < programList.length; i++) {
			if (programList[i].status == "active") {
				let startDate = moment(programList[i].start_date);
				let endDate = moment(programList[i].end_date);

				programList[i]['start_date_formatted'] = startDate.format("MMM Do YYYY, h:mma");
				programList[i]['end_date_formatted'] = endDate.format("MMM Do YYYY, h:mma");
				activeProgram.push(programList[i]);
			}
		}
		let renderData = {
			programs: activeProgram,
		}
		response.render('program_index', renderData);

	},
	
};