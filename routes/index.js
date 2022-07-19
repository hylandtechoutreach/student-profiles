const db = require("../database/db");

module.exports = {
	getHomePage: async function (request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}
		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents
<<<<<<< HEAD
		}

		response.render('index', renderData);
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> baf592c (rebased)
		}

		response.render('index', renderData);
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents
		}
		
		response.render('index', renderData);
	},

	filter: async function (request, response) {
		let studentList = await db.getStudentsList();
		let filteredGrade = request.params.grade;

		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		let filteredStudents = [];
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i]);
			}
		}

		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents
<<<<<<< HEAD
=======
>>>>>>> 611cb12 (Now always alphabetical, can now search for name)
		}
		
		response.render('index', renderData);
	},

	filter: async function (request, response) {
		let studentList = await db.getStudentsList();
		let filteredGrade = request.params.grade;

		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		let filteredStudents = [];
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i]);
			}
		}

		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents
=======
>>>>>>> 4f81e27 (Now always alphabetical, can now search for name)
=======
>>>>>>> baf592c (rebased)
		}

		response.render('index', renderData);
		
	},

	sortFirstNames: async function(request, response) {
		let studentList = await db.getStudentsList();
		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		activeStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: 'none',
			students: activeStudents
		}
		
		response.render('index', renderData);
	},

	filter: async function (request, response) {
		let studentList = await db.getStudentsList();
		let filteredGrade = request.params.grade;

		let activeStudents = [];
		for (let i = 0; i < studentList.length; i++) {
			if (studentList[i].status == "active") {
				activeStudents.push(studentList[i]);
			}
		}

		let filteredStudents = [];
		for (let i = 0; i < activeStudents.length; i++) {
			if (activeStudents[i].grade == filteredGrade) {
				filteredStudents.push(activeStudents[i]);
			}
		}

		filteredStudents.sort( (a, b) => a.first_name.localeCompare(b.first_name, 'fr', {
			ignorePunctuation: true
		}));

		let renderData = {
			path: filteredGrade,
			students: filteredStudents
		}

		response.render('index', renderData);
	}
};