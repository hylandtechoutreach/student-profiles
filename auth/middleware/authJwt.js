const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  //console.log(req.headers);
  let token = req.headers['cookie'] || req.headers["x-access-token"] || req.headers['authorization'] || req.query.token || req.body.token;
  //console.log(token);

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }
  
  if (token.substring(0, 6) == 'token=') {
    token = token.substring(6);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  let user = User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.userType == 'admin') {
      next();
      return;
    } else {
      res.status(403).send({ message: 'Admin role required!' });
      return;
    }
  });
};

isStudentOrAdmin = (req, res, next) => {
  let user = User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.userType == 'admin' || user.userType == 'student') {
      next();
      return;
    } else {
      res.status(403).send({ message: 'Student role required!' });
      return;
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