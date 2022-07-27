const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers['cookie'] //|| req.headers["x-access-token"] || req.headers['authorization'] || req.query.token || req.body.token;

  if (!token) {
    let renderData = {
      message: ""
    }
    return res.render('signin', renderData)
  }
  
  if (token.substring(0, 6) == 'token=') {
    token = token.substring(6);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      let renderData = {
        message: err
        // "Unauthorized!"
      }
       return res.render('signin', renderData)
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  let user = User.findById(req.userId).exec((err, user) => {
    if (err) {
      let renderData = {
        message: err
      }
      return res.render('signin', renderData)
    }

    if (user.userType == 'admin') {
      next();
      return;
    } else {
      let renderData = {
        message: 'Admin role required!'
      }
      return res.render('signin', renderData)
    }
  });
};

isStudentOrAdmin = (req, res, next) => {
  let user = User.findById(req.userId).exec((err, user) => {
    if (err) {
      let renderData = {
        message: err
      }
      return res.render('signin', renderData)
    }

    if (user.userType == 'admin' || user.userType == 'student') {
      next();
      return;
    } else {
      let renderData = {
        message: 'Student role required!'
      }
      return res.render('signin', renderData)
    }
  });
};

//Can probably make one function that takes an array of authorized roles as an argument

const authJwt = {
  verifyToken,
  isAdmin,
  isStudentOrAdmin
};
module.exports = authJwt;