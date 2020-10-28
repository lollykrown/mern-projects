const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const User = require('../../models/users')
const bcrypt = require('bcryptjs');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      (async function auth() {
        try {
          debug(username, password)
          // const query = { $or: [{ email: { $regex: username, $options: 'i' } }, { phone: { $regex: username, $options: 'i' } }] }

          // User.find( { $or:[ {email:username}, {phone:username} ]},function (err, user) {
          User.findOne({ username }, function (err, result) {
            if (err) return done(err);
            if (!result) {
              debug('User not found')
              return done(null, false, {
                status: false,
                message: 'Incorrect username'
              });
            }
            bcrypt.compare(password, result.password).then(valid => {
              debug(valid)
              if (!valid) {
                debug('Invalid password')
                return done(null, false, {
                  status: false,
                  message: 'Incorrect password'
                })
              }
              //if(user && valid){
                const user = {
                  id: result._id,
                  email: result.email,
                  username: result.username,
                  profileName: result.profileName,
                }
                return done(null, user, {
                  status: true,
                  message: 'Success'
                });
              //}
            }).catch(err => debug(err));

          })
        } catch (err) {
          debug(err.stack)
          return done(err)
          // res.status(500).json({
          //   message: 'Internal Server Error'
          // });
        }
      }());
    }
  ));
};