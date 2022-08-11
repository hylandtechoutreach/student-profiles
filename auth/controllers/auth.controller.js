const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const student_db = require('../../database/db')
const student = require('../../routes/student')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const body = req.body
  let user

  if (body.userType == 'unregistered' || body.userType == 'admin') {
    user = new User({
      username: body.username,
      email: body.email,
      password: bcrypt.hashSync(body.password, 8),
      userType: body.userType
    });

    user.save((err, user) => {
      if (err) {
        let renderData = {
          message: err
        }
        return res.render('signin', renderData)
      }
    //Automatically signs user in after signup
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true
    });

    if (req.body.userType) {
      let renderData = {
        message: "User was registered successfully!"
      }
      return res.render('signin', renderData)
    }
  })
  } else if (body.userType == 'student') {
    student.addStudent(req, res)
  }
  }

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
      if (err) {
        let renderData = {
          message: err
        }
        return res.render('signin', renderData)
      }

      if (!user) {
        let renderData = {
          message: "User Not found."
        }
        return res.render('signin', renderData)
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        let renderData = {
          message: "Invalid Password!"
        }
        return res.render('signin', renderData)
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: '1h'
      });

      res.cookie('token', token, {
        httpOnly: true
      });

      if (user.userType != 'unregistered') {
        res.redirect('/');
      } else {
        res.redirect('/program')
      }
    });
};