const express = require('express');
const mongoose = require("mongoose");
const configKeys = require("./config/keys");
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 8080;

const index = require('./routes/index');
const student = require('./routes/student');
const imageMimeTypes = ['image/jpeg','image/png','image/gif'];

let app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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

app.get('/', index.getHomePage)
app.get('/add', student.addStudentPage);
app.get('/edit/:id', student.editStudentPage);
app.get('/delete/:id', student.deleteStudent);
app.get('/reactivate/:id', student.reactivateStudent);
app.post('/add', student.addStudent);
app.post('/edit/:id', student.editStudent);

app.post('/addImage',async(req, res, next) => {
  const {img} = req.body;
  const Student = new Student();
  saveImage(Student,img);
  try{
    const newStudent = await Student.save();
    res.redirect(req.path)
  }catch(err){
    console.log(err);
  }
});

function saveImage(Student, imgEncoded) {
  if(imgEncoded == null) return;

  const img = JSON.parse(imgEncoded);

  if (im != null&&imageMimeTypes.includes(img.type)){
    Student.img = new Buffer.from(img.data,'base64');
    Student.imgType = img.type;
  }
}

function listenCallback() {
	console.log(`Server Running on http://${hostname}:${port}`);
}

app.listen(port, hostname, listenCallback);