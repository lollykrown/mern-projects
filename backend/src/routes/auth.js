const express = require("express");
const authRouter = express.Router();
const { signUpWithEmail, signOut } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

// router.route("/me").get(protect, me);

function router() {
    //sign up with email
    authRouter.route("/signup").post(signUpWithEmail)
  
    //custom callback for logging in
    authRouter
      .route("/login")
      .post((req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
          console.log(info);
          if (err) {
            console.log(err)
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
              console.log(err)
              //logger.error(err)
              return next(err);
            }
            return res.status(200).json({status:true,message:'logged in',user});
          });
        })(req, res, next);
      });
  
    authRouter.route("/logout").get(signOut);
  
    return authRouter;
  }
  
  module.exports = router;