const program_db = require("../database/program_db")
const student_db = require("../database/db")
const application_db = require("../database/application_db")
const jwt = require('jsonwebtoken');
const userDb = require("../auth/models");
const User = userDb.user;
const config = require('../auth/config/auth.config');
module.exports = {
    addApplication: async function (request, response) {
        let studentId = request.params.id;
        let programId = request.params.program_id;
        let token = request.headers['cookie']

        if (!token) {
            let renderData = {
                message: ""
            }
            return res.render('signin', renderData)
        }

        token = token.substring(6);
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) {
                let renderData = {
                    message: ""
                }
                return res.render('signin', renderData)
            }
            //
            let studentObj = await student_db.getStudentById(studentId);
            let programObj = await program_db.getProgramById(programId);

            await application_db.addApplication(studentObj, programObj);
            
            return response.redirect('/program');
            
    })	
    },
    getApplications: async function (request, response) {
        let applicationList = await application_db.getApplicationsList();
        let renderData = {
            applications: applicationList,
        }

        return response.render('applications', renderData);
    },
}