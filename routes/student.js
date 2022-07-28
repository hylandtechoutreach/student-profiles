const countries = require("countries-list").countries;
const { response } = require("express");
const db = require("../database/db");

module.exports = {
	addStudentPage: function (request, response) {
		let renderData = {
			student: {},
			add: true,
			view: false,
			countries: countries
		};

		response.render('edit-student', renderData);
	},
	viewStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);
		
		let renderData = {
			student: studentObj,
			add: false,
			view: true,
			countries: countries
		};

		response.render('edit-student', renderData);
	},

	addStudent: async function (request, response) {
		await db.addStudent(request.body);

		response.redirect('/')
	},

	editStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		let renderData = {
			student: studentObj,
			add: false,
			view: false,
			countries: countries
		};

		response.render('edit-student', renderData);
	},

	editStudent: async function (request, response) {
		let studentId = request.params.id;
		await db.editStudentById(studentId, request.body);
		await module.exports.viewStudentPage(request, response)
	},

	deleteStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		studentObj['status'] = 'inactive';
		await db.editStudentById(studentId, studentObj);

		response.redirect('/');
	},

	reactivateStudent: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		studentObj['status'] = 'active';
		await db.editStudentById(studentId, studentObj);

		response.redirect('/');
	},

	increaseStudentGrades: async function (request, response) {
		let grades = ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "College Freshman", "College Sophmore", "College Junior", "College Senior", "Out of School"];
		let students = await db.getStudentsList();

		for (let i = 0; i < students.length; i++) {
			let currentGradeIndex = grades.indexOf(students[i].grade);
			if (currentGradeIndex < grades.length) { //Won't increment if out of school
				let studentObj = students[i];
				studentObj['grade'] = grades[currentGradeIndex + 1];
				await db.editStudentById(studentObj.id, studentObj);
			}
		}

		response.redirect('/');
	}
};
