const express = require("express");
const authRouter = express.Router();
const passport = require('passport');
const authController = require("../controllers/authController");

function router() {
    const { signUpWithEmail, signOut } = authController()
    //sign up with email
    authRouter.route("/signup").post(signUpWithEmail)

    // when login failed, send failed msg
authRouter.route("/login/failed").get((req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    });
  });

    // Signup/login with github
    authRouter.get('/github',
        passport.authenticate('github', { scope: ['read:user', 'user:email'] }))

    // The middleware receives the data from Github and runs the function on Strategy config
    authRouter.get('/github/callback', passport.authenticate('github'),
        (req, res) => {
            // res.redirect('/')
            res.status(200).json({ message: "you reached the redirect URI", user: req.user });
        });

    //custom callback for logging in
    authRouter
        .route("/login")
        .post((req, res, next) => {
            passport.authenticate("local", (err, user, info) => {
                console.log('info', info);
                if (err) {
                    console.log('what', err)
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({
                        message: info.message,
                        error: "Cannot log in",
                    });
                }
                // if (!user) { return res.render('404'); }
                req.logIn(user, function (err) {
                    if (err) {
                        console.log('er', err)
                        //logger.error(err)
                        return next(err);
                    }
                    return res.status(200).json({
                        status: true,
                        message: 'logged in',
                        data: user
                    });
                });
            })(req, res, next);
        });

    authRouter.route("/me").get((req, res) => {
        if (req.user) {
            console.log('user', req.user)

            res.status(200)
                .json({
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

    return authRouter;
}

module.exports = router;