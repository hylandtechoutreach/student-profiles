const mongoose = require('mongoose');
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            enum: ['unregistered', 'student', 'admin'],
            default: 'unregistered',
            required: true
        },
        studentId: {
            type: String,
            required: false
        }
    })
);
module.exports = User;
