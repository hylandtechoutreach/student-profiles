const express = require('express');
const mongoose = require("mongoose");
const configKeys = require("./config/keys");

//Probably move this and all file upload stuff to student.js
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
let Image = require('./models/Image');

const hostname = 'localhost';
const port = 8080;

const index = require('./routes/index');
const program_index = require('./routes/program_index');
const student = require('./routes/student');
const program = require('./routes/program');

let app = express();
app.use(express.static("config"))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded(
  { extended: true }
));

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

let upload = multer({ storage: storage });


const dbStr = configKeys.mongoURI;
const dbSettings = {
	useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "student_profiles",
  useFindAndModify: false
}
// connect to mongodb
mongoose.connect(dbStr, dbSettings)
  .then(() => console.log("MongoDB successfully connected"))
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

app.get('/view_program/:id', program.viewProgramPage);
app.get('/program_delete/:id', program.deleteProgram);
app.get('/program_reactivate/:id', program.reactivateProgram);
app.get('/program', program_index.getProgramPage);
app.get('/program_add', program.addProgramPage);
app.get('/program_edit/:id', program.editProgramPage);
app.post('/program_add', program.addProgram);
app.post('/program_edit/:id', program.editProgram);

app.get('/uploadfile/:id', (req, res) => {
  let studentId = req.params.id
  res.render('file-upload', { studentId: studentId });
})
app.post('/uploadfile/:id', upload.single('myImage'), async (req, res) => { //Creates a temp file to reference
  let img = fs.readFileSync(req.file.path);
  let encode_img = img.toString('base64');
  let final_img = {
    student: req.params.id,
    contentType: req.file.mimetype,
    img: new Buffer.from(encode_img, 'base64')
  };
  
  if (!!await Image.findOne({ student: studentId })) {
    console.log()
  }
  Image.create(final_img, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      fs.unlinkSync(req.file.path); //Removes the file created earlier so as to not take up space
      res.redirect('/');
    }
  });
})

app.get('/retrievephoto', async (req, res) => {
  let image = await Image.findOne({ _id: '62f3d0e38fac2b39d03a4583'});
  image['test'] = 'testing';
  await Image.findOneAndUpdate({ _id: '62f3d0e38fac2b39d03a4583' }, image);
  console.log(image.img);
  res.render('retrieve-file', { image: image });
})

function listenCallback() {
	console.log(`Server Running on http://${hostname}:${port}`);
}

app.listen(port, hostname, listenCallback);
