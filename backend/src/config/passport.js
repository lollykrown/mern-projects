const passport = require('passport');
require('./strategies/local.strategy')();
// require('./strategies/fb.strategy')();
// require('./strategies/twitter.strategy')();
// require('./strategies/google.strategy')();
// require('./strategies/github.strategy')();

const User = require("../models/users");

module.exports = function passportConfig(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    //stores user in session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //Retrieves user from session
    passport.deserializeUser((id, done) => {
        User.findById(id).then(user =>{

        //if (err) { return done(err); }
        done(null, user);
    })
    });
}
