const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const debug = require("debug")("app:authRoutes");

function router() {
  const { signUpWithEmail, signOut, changePassword } = authController();
  //sign up with email
  authRouter.route("/signup").post(signUpWithEmail);

  // Signup/login with github
  authRouter.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["read:user", "user:email"] })
  );

  // The middleware receives the data from Github and runs the function on Strategy config
  authRouter.get('/auth/github/callback', passport.authenticate('github'),
      (req, res) => {
          //res.send(req.user)
          debug('auth routes',req.user)
          res.redirect('http://127.0.0.1:3000');
          // res.redirect('https://mern-backend.herokuapp.com');

          // res.status(200).json({ message: "you reached the redirect URI", user: req.user });

      });

        // Signup/login with twitter
  authRouter.get(
    "/auth/twitter",
    passport.authenticate("twitter", { scope: ["read:user", "user:email"] })
  );

  // The middleware receives the data from Github and runs the function on Strategy config
  authRouter.get('/auth/twitter/callback', passport.authenticate('twitter'),
      (req, res) => {
          //res.send(req.user)
          debug('tweet routes',req.user)
          res.redirect('http://127.0.0.1:3000');
          // res.redirect('https://mern-backend.herokuapp.com');

          // res.status(200).json({ message: "you reached the redirect URI", user: req.user });

      });

  //custom callback for logging in
  authRouter.route("/login").post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      console.log("info", info);
      if (err) {
        console.log("what", err);
        return next(err);
      }
      if (!user) {
        return res.status(400).json({
          status: false,
          message: info.message,
          error: "Cannot log in",
        });
      }
      // if (!user) { return res.render('404'); }
      req.logIn(user, function (err) {
        if (err) {
          console.log("er", err);
          //logger.error(err)
          return next(err);
        }
        return res.status(200).json({
          status: true,
          message: "logged in",
          data: user,
        });
      });
    })(req, res, next);
  });

  authRouter.route("/me").get((req, res) => {
    if (req.isAuthenticated) {
      debug("user", req.user);

      res.status(200).json({
        status: true,
        data: req.user,
      });
    } else {
      res.status(203).json({
        status: false,
        message: "You need to login first",
      });
    }
  });

  authRouter.route("/logout").get(signOut);

  authRouter.route("/change-password").put(changePassword);

  return authRouter;
}

module.exports = router;
