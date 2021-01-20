const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../../models/User')
const debug = require('debug')('app:TwitterStrategy')

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.module.exports = function localStrategy() {
module.exports = function twitterStrategy() {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://127.0.0.1:8001/auth/twitter/callback'
    // callbackURL: 'https://mern-backend.herokuapp.com/auth/twitter/callback'
    // proxy: trustProxy
  },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   console.log('google passport', user)
      //   return done(err, user);
      // });
      debug('twitter', profile)
      User.findOne({ twitterId: profile.id }).then((user) => {
        if (user) {
          //if we already have a record with the given profile ID
          done(null, user);
        } else {
          //if not, create a new user 
          new User({
            twitterId: profile.id,
            username: profile.username,
            fullname: profile.displayName ||' Full Name',
            avatar: profile._json.profile_image_url_https,
            email:profile._json.email || 'example@example.com',
            bio:profile._json.bio || '',
            website:profile._json.blog
          }).save().then((newUser) => {
            const u = {...newUser, password:''}
            debug('new user',u)
            done(null, u);
          });
        }
      })

    }
  ))
};