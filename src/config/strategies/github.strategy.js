const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../../models/User')

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.module.exports = function localStrategy() {

module.exports = function googleStrategy() {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: 'http://127.0.0.1:8001/auth/github/callback'
    callbackURL: '/github/callback'
  },
    function (accessToken, refreshToken, profile, done) {
      console.log('p',profile, 'at',accessToken, 'reft', refreshToken)
      User.findOne({ githubId: profile.id }).then((user) => {
        if (user) {
          //if we already have a record with the given profile ID
          done(null, user);
        } else {
          //if not, create a new user 
          new User({
            githubId: profile.id,
            username: profile.username,
            fullname: profile.displayName ||'full name',
            avatar: profile._json.avatar_url,
            email:profile._json.email || 'example@example.com',
            bio:profile._json.bio || '',
            website:profile._json.blog
          }).save().then((newUser) => {
            done(null, newUser);
          });
        }
      })

    }
  ))
};