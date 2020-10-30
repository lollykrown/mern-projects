const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/User')

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.module.exports = function localStrategy() {
module.exports = function googleStrategy() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   console.log('google passport', user)
      //   return done(err, user);
      // });
      User.findOne({ googleId: profile.id }).then((user) => {
        if (user) {
          //if we already have a record with the given profile ID
          done(null, user);
        } else {
          //if not, create a new user 
          new User({
            googleId: profile.id,
          }).save().then((newUser) => {
            done(null, newUser);
          });
        }
      })

    }
  ))
};