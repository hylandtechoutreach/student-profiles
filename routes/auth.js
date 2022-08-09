const countries = require("countries-list").countries

module.exports = {
    getSigninPage: function (request, response) {
        let renderData = {
            message: ""
        }
        response.render('signin', renderData);
    },

    getSignupPage: function (request, response) {
        let renderData = {
            countries: countries
        }

        response.render('signup', renderData);
    }
}