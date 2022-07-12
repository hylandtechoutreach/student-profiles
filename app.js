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
//const dbConfig = require('./app/config/db.config');

// connect to mongodb
mongoose.connect(dbStr, dbSettings)
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch(err => console.log(err));

require('./auth/routes/auth.routes')(app);
app.get('/api/auth/signup', auth.getSignupPage);
app.get('/api/auth/signin', auth.getSigninPage);

app.get('/', [authJwt.verifyToken] ,index.getHomePage);
app.get('/add', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.addStudentPage);
app.get('/edit/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.editStudentPage);
app.get('/delete/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.deleteStudent);
app.get('/reactivate/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.reactivateStudent);
app.get('/next-grade', [authJwt.verifyToken, authJwt.isAdmin], student.increaseStudentGrades);
app.get('/filter/:grade', [authJwt.verifyToken], index.filter);
app.post('/add', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.addStudent);
app.post('/edit/:id', [authJwt.verifyToken, authJwt.isStudentOrAdmin], student.editStudent);

app.get('/program_delete/:id', [authJwt.verifyToken, authJwt.isAdmin], program.deleteProgram);
app.get('/program_reactivate/:id', [authJwt.verifyToken, authJwt.isAdmin], program.reactivateProgram);
app.get('/program', [authJwt.verifyToken], program_index.getProgramPage);
app.get('/program_add', [authJwt.verifyToken, authJwt.isAdmin], program.addProgramPage);
app.get('/program_edit/:id', [authJwt.verifyToken, authJwt.isAdmin], program.editProgramPage);
app.post('/program_add', [authJwt.verifyToken, authJwt.isAdmin], program.addProgram);
app.post('/program_edit/:id', [authJwt.verifyToken, authJwt.isAdmin], program.editProgram);

function listenCallback() {
	console.log(`Server Running on http://${hostname}:${port}`);
}

app.listen(port, hostname, listenCallback);

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: 'moderator'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }
        console.log("added 'admin' to roles collection");
      })
    }
  })
}