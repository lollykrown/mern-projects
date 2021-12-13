const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateString } = require('../utils/random')()
const debug = require('debug')('app:authController')

function authController() {
  // Sign up with email address
  function signUpWithEmail(req, res) {
    (async function auth() {
      try {
        let { username, fullname, email, password } = req.body;
        if (!username) {
          res.status(423).send({
            status: false,
            message: "Please provide your firstname",
          });
          return;
        }
        if (!fullname) {
          res.status(400).send({
            status: false,
            message: "Please provide your last name",
          });
          return;
        }
        if (!email) {
          res.status(423).send({
            status: false,
            message: "You must provide your email address",
          });
          return;
        }
        if (!password) {
          res.status(400).send({
            status: false,
            message: "Password is required",
          });
          return;
        }

        console.log(username, fullname, email, password)
        const user = await User.findOne({ username }).exec();
        if (user) {
          return res
            .status(423)
            .send({
              status: false,
              message:
                "An account with this username already exists",
            });
        }

        bcrypt
          .hash(password, 10)
          .then((p) => {
            const user = new User({
              email,
              password:p,
              username,
              fullname,
            });
            user.save().then((newUser) => {
              console.log(newUser);
            });
          })
          .then(() => {
            res.status(201).json({
              status: true,
              message:
                "You have been successfully registered,",
            });
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    })();
  }

  // sign out
  function signOut(req, res) {
    req.logout();
    if (req.session) req.session.destroy();
    res.clearCookie("_sid");
    debug("you are now logged out");
    // app.use(function (req, res, next) {
    //   if (!req.user)
    //     res.header(
    //       "Cache-Control",
    //       "private, no-cache, no-store, must-revalidate"
    //     );
    //   next();
    // });
    res.json({ status: true, message: "logged out" });
  }

  function getUser(req, res) {
    (async function auth() {
      try {
        let username = req.params.username;

        const user = await User.findOne({ username }).select('-email -password')
          .populate({ path: 'following', select: '-email -password' }).exec();
        if (!user) {
          return res
            .status(423)
            .send({
              status: false,
              message:
                "An account with this username does not exist",
            });
        }

        res.status(200).json({
          status: true,
          user
        });

      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    })();
  }

  function sendPasswordResetLink(req, res) {
    (async function auth() {
      try {
        const { email } = req.body
        if (!email) {
          res.status(423).send({
            status: false,
            message: 'You must provide your email address'
          })
          return
        }
        const user = await User.findOne({ email }).exec()
        if (!user) {
          return res.status(423)
            .send({ status: false, message: 'No account with this email/phone exists' })
        }
        const str = generateString()
        debug(str)
        const resetToken = token(str)
        debug(resetToken)
        const name = `${user.firstName} ${user.lastName}`
        const addToken = await User.findByIdAndUpdate({ _id: user._id }, { $set: { pwdResetToken: resetToken } }, { new: true }).exec()
        sendPasswordResetLinkMail(email, resetToken, name)

        res.status(200).json({
          message: 'Password Reset link sent'
        })
      } catch (err) {
        debug(err.stack)
        res.status(500).json({
          message: 'Internal Server Error'
        });
      }
    }());
  }

  function verifyResetLink(req, res) {
    (async function auth() {
      try {
        const tokenn = req.params.token
        if (!tokenn) {
          res.status(400).send({
            status: false,
            message: 'No Reset token'
          })
          return
        }
        const pwdResetToken = decodeURIComponent(decodeURIComponent(tokenn))
        debug('encoded:', tokenn)
        debug('decoded:', pwdResetToken)

        let tok = await User.findOne({ pwdResetToken }).exec()
        debug(tok)
        if (!tok) {
          return res.status(423)
            .send({ status: false, message: 'Invalid Token' })
        }
        debug(tok.pwdResetToken)
        if (pwdResetToken === tok.pwdResetToken) {
          res.render('reset-password', {email: tok.email})
          //res.status(200).send('link verified')
        }
      } catch (err) {
        debug(err.stack)
        res.status(500).json({
          message: 'Internal Server Error'
        });
      }
    }());
  }

  function changePassword(req, res) {
    (async function auth() {
      try {
        let { email, newPassword, confirmPassword } = req.body
        if (!confirmPassword || !newPassword) {
          res.status(423).send({
            status: false,
            message: 'All password fields are required'
          })
          return
        }
        // const decodedToken = decodeURIComponent(req.params.token)
        debug(email, newPassword, confirmPassword)
        const user = await User.findOne({ email }).exec()
        debug(user)
        if (!user) {
          return res.status(423)
            .send({ status: false, message: 'Email not registered' })
        }
        // const name = `${user.firstName} ${user.lastName}`
        bcrypt.hash(newPassword, 10)
          .then(password => {
            User.findByIdAndUpdate({ _id: user._id }, { $set: { password } }, { new: true }).exec()
              .then(u => {
                // res.status(201).json({
                //   status: true,
                //   message: 'Password changed successfully',
                //   user: u
                // })
              }).catch(err => debug(err))
          }).catch(err => debug(err))
        // const reset = await User.findByIdAndUpdate({ _id: user._id }, { $set: { pwdResetToken: '' } }, { new: true }).exec()
        // debug(reset)
        // sendPasswordResetConfirmationMail(reset.email, name)
        req.logout();
        if (req.session)req.session.destroy();
        res.clearCookie("_sid");
        res.status(200).json({ status: true, message: 'Your password has been changed successfully, Login with your new password' })

      } catch (err) {
        debug(err.stack)
        res.status(500).json({
          message: 'Internal Server Error'
        });
      }
    }());
  }

  return {
    changePassword,
    signUpWithEmail,
    signOut,
    getUser,
  };
}

module.exports = authController;
