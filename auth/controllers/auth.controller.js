const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    userType: req.body.userType
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
  });
    
};

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

      res.redirect('/');
    });
};