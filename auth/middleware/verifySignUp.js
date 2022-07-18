const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
checkDuplicateUsernameOrEmail = (req, res, next) => {
    //Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (user) {
            res.status(400).send({message: "Failed! Username is already in use!"});
            return;
        }
        //Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (user) {
                res.status(400).send({message: "Failed! Email is already in use!"});
                return;
            }
            next();
        });
    });
};
//This seems kinda redundant
checkRolesExisted = (req, res, next) => {
    if (req.body.userType) {
        if (req.body.userType != 'unregistered' && req.body.userType != 'student' && req.body.userType != 'admin') {
            res.status(400).send({
                message: `Failed! Role ${req.body.userType} does not exist!`
            });
            return;
        }
    }
    next();
};
const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};
module.exports = verifySignUp;