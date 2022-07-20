
module.exports = {
    getSigninPage: function (request, response) {
        response.render('signin');
    },

    getSignupPage: function (request, response) {
        response.render('signup');
    }
}