const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
checkDuplicateUsernameOrEmail = (req, res, next) => {
    //Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            let renderData = {
                message: err
              }
            return res.render('signin', renderData)
        }
        if (user) {
            let renderData = {
                message: "Failed! Username is already in use!"
              }
            return res.render('signin', renderData)
            return;
        }
        //Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                let renderData = {
                    message: err
                  }
                return res.render('signin', renderData)
            }
            if (user) {
                let renderData = {
                    message: "Failed! Email is already in use!"
                  }
                return res.render('signin', renderData)
            }
            next();
        });
    });
};
//This seems kinda redundant
checkRolesExisted = (req, res, next) => {
    if (req.body.userType) {
        if (req.body.userType != 'unregistered' && req.body.userType != 'student' && req.body.userType != 'admin') {
            let renderData = {
                message: `Failed! Role ${req.body.userType} does not exist!`
              }
            return res.render('signin', renderData)
        }
    }
    next();
};
const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};
module.exports = verifySignUp;