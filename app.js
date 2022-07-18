const express = require('express');
const mongoose = require("mongoose");
const configKeys = require("./config/keys");
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

let app = express();

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

app.get('/', index.getHomePage);
app.get('/sort', index.sortFirstNames);
app.get('/unsort', index.getHomePage);
app.get('/add', student.addStudentPage);
app.get('/edit/:id', student.editStudentPage);
app.get('/delete/:id', student.deleteStudent);
app.get('/reactivate/:id', student.reactivateStudent);
app.get('/next-grade', student.increaseStudentGrades);
app.get('/filter/:grade', index.filter);
app.get('/view/:id', student.viewStudentPage);
app.post('/add', student.addStudent);
app.post('/edit/:id', student.editStudent);

require('./auth/routes/auth.routes')(app);
require('./auth/routes/user.routes')(app);
app.get('/api/auth/signup', (req, res) => {
  res.render('signup');
});
app.get('/api/auth/signin', (req, res) => {
  res.render('signin');
});

app.get('/program_delete/:id', program.deleteProgram);
app.get('/program_reactivate/:id', program.reactivateProgram);
app.get('/program', program_index.getProgramPage);
app.get('/program_add', program.addProgramPage);
app.get('/program_edit/:id', program.editProgramPage);
app.post('/program_add', program.addProgram);
app.post('/program_edit/:id', program.editProgram);

function listenCallback() {
	console.log(`Server Running on http://${hostname}:${port}`);
}

app.listen(port, hostname, listenCallback);