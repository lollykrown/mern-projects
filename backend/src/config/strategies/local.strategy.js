const passport = require('passport');
const { Strategy } = require('passport-local');
// const debug = require('debug')('app:local.strategy');
const User = require('../../models/User')
const bcrypt = require('bcryptjs');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      (async function auth() {
        try {
          console.log(username, password)
          User.findOne({ username }, function (err, result) {
            if (err) return done(err);
            if (!result) {
              console.log('User not found')
              return done(null, false, {
                status: false,
                message: 'Incorrect username'
              });
            }
            console.log(result)
            bcrypt.compare(password, result.password).then(valid => {
              console.log(valid)
              if (!valid) {
                console.log('Invalid password')
                return done(null, false, {
                  status: false,
                  message: 'Password is Incorrect'
                })
              }
              //if(user && valid){
                const user = {
                  id: result._id,
                  email: result.email,
                  username: result.username,
                  fullname: result.fullname,
                  avatar: result.avatar
                }
                return done(null, user, {
                  status: true,
                  message: 'Success'
                });
              //}
            }).catch(err => console.log(err));

          })
        } catch (err) {
          console.log(err.stack)
          return done(err)
          // res.status(500).json({
          //   message: 'Internal Server Error'
          // });
        }
      }());
    }
  ));
};