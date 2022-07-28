const { response } = require("express");
const db = require("../database/db");
const moment = require('moment');

module.exports = {
	addStudentPage: function (request, response) {
		let renderData = {
			student: {},
			add: true,
			view: false
		};

		response.render('edit-student', renderData);
	},
	viewStudentPage: async function (request, response) {
		let studentId = request.params.id;
		let studentObj = await db.getStudentById(studentId);

		let dateOfBirth = moment.utc(studentObj.dateOfBirth);
		studentObj['dateOfBirthFormatted'] = dateOfBirth.format('YYYY[-]MM[-]DD');
		
		let renderData = {
			student: studentObj,
			add: false,
			view: true
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

		let dateOfBirth = moment.utc(studentObj.dateOfBirth);
		studentObj['dateOfBirthFormatted'] = dateOfBirth.format('YYYY[-]MM[-]DD');

		let renderData = {
			student: studentObj,
			add: false,
			view: false
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

	//Currently doesn't account for:
	//People who skip a year or get held back
	//People who are in college for anything other than 4 years
	//People who drop out
	increaseStudentGrades: async function (request, response) {
		let grades = ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Out of High School", "College Freshman", "College Sophmore", "College Junior", "College Senior", "Out of College"];
		let students = await db.getStudentsList();

		for (let i = 0; i < students.length; i++) {
			let currentGradeIndex = grades.indexOf(students[i].grade);
			if (currentGradeIndex < grades.length && students[i].grade != 'Out of High School') { //Won't increment if out of high school or college
				let studentObj = students[i];
				if (studentObj.grade == '12th') {
					studentObj['grade'] = 'College Freshman';
				} else {
					studentObj['grade'] = grades[currentGradeIndex + 1];
				}
				await db.editStudentById(studentObj.id, studentObj);
			}
		}

		response.redirect('/');
	}
};
