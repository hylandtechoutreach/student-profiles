const express = require('express');
const mongoose = require("mongoose");
const configKeys = require("./config/keys");
const authJwt = require('./auth/middleware/authJwt');
const cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:8081'
}

const hostname = 'localhost';
const port = 8080;

const index = require('./routes/index');
const program_index = require('./routes/program_index');
const student = require('./routes/student');
const program = require('./routes/program');
const auth = require('./routes/auth');

let app = express();
app.use(express.static("config"))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

const dbStr = configKeys.mongoURI;
const dbSettings = {
	useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "student_profiles",
  useFindAndModify: false
}
// connect to mongodb
mongoose.connect(dbStr, dbSettings)
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch(err => console.log(err));

require('./auth/routes/auth.routes')(app);
app.get('/api/auth/signup', auth.getSignupPage);
app.get('/api/auth/signin', auth.getSigninPage);

app.get('/', [authJwt.verifyToken, authJwt.isStudentOrAdmin] ,index.getHomePage);
app.get('/sort', [authJwt.verifyToken, authJwt.isStudentOrAdmin], index.sortFirstNames);
app.get('/unsort', [authJwt.verifyToken, authJwt.isStudentOrAdmin], index.getHomePage);
app.get('/add', [authJwt.verifyToken, authJwt.isAdmin], student.addStudentPage);
app.get('/edit/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.editStudentPage);
app.get('/delete/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.deleteStudent);
app.get('/reactivate/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.reactivateStudent);
app.get('/next-grade', [authJwt.verifyToken, authJwt.isAdmin], student.increaseStudentGrades);
app.get('/filter/:grade', [authJwt.verifyToken], index.filter);
app.get('/view/:id', [authJwt.verifyToken], student.viewStudentPage);
app.post('/add', [authJwt.verifyToken, authJwt.isAdmin], student.addStudent);
app.post('/edit/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.editStudent);

app.get('/view_program/:id', [authJwt.verifyToken],program.viewProgramPage);
app.get('/program_delete/:id', [authJwt.verifyToken, authJwt.isAdmin], program.deleteProgram);
app.get('/program_reactivate/:id', [authJwt.verifyToken, authJwt.isAdmin], program.reactivateProgram);
app.get('/program', [authJwt.verifyToken], program_index.getProgramPage);
app.get('/program_add', [authJwt.verifyToken, authJwt.isAdmin], program.addProgramPage);
app.get('/program_edit/:id', [authJwt.verifyToken, authJwt.isAdmin], program.editProgramPage);
app.post('/program_add', [authJwt.verifyToken, authJwt.isAdmin], program.addProgram);
app.post('/program_edit/:id', [authJwt.verifyToken, authJwt.isAdmin], program.editProgram);
app.get('/view_program/:id', [authJwt.verifyToken], program.viewProgramPage);

app.get('/applications', [authJwt.verifyToken, authJwt.isAdmin], application.getApplications);
app.get('/application/accept/:id', [authJwt.verifyToken, authJwt.isAdmin], application.acceptApplication);
app.get('/application/deny/:id', [authJwt.verifyToken, authJwt.isAdmin], application.denyApplication);
app.get('/application_apply/:id/:program_id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], application.addApplication);



function listenCallback() {
	console.log(`Server Running on http://${hostname}:${port}`);
}

app.listen(port, hostname, listenCallback);