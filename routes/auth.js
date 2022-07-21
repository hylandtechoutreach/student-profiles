
module.exports = {
    getSigninPage: function (request, response) {
        let renderData = {
            message: ""
        }
        response.render('signin', renderData);
    },

    getSignupPage: function (request, response) {
        response.render('signup');
    }
}