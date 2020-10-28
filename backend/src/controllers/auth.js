const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

function userController() {
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
          .then((password) => {
            const user = new User({
              email,
              password,
              username,
              profileName,
              profilePictureUrl
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

  // function signup (req, res){
  //   const { fullname, username, email, password } = req.body;
  
  //   const user = await User.create({ fullname, username, email, password });
  
  //   const token = user.getJwtToken();
  
  //   res.status(200).json({ success: true, token });
  // };

  // function login(req, res) {
  //   (async function auth() {
  //     try {
  //       const { email, password } = req.body;

  //       // make sure the email, pw is not empty
  //       if (!email || !password) {
  //         return next({
  //           message: "Please provide email and password",
  //           statusCode: 400,
  //         });
  //       }

  //       // check if the user exists
  //       const user = await User.findOne({ email });

  //       if (!user) {
  //         return next({
  //           message: "This email is not yet registered",
  //           statusCode: 400,
  //         });
  //       }

  //       // if exists, make sure the password matches
  //       const match = await user.checkPassword(password);

  //       if (!match) {
  //         return next({ message: "The password does not match", statusCode: 400 });
  //       }
  //       const token = user.getJwtToken();

  //       // then send json web token as response
  //       res.status(200).json({ success: true, token });
  //     } catch (err) {
  //       console.log(err.stack);
  //       res.status(500).json({
  //         message: "Internal Server Error",
  //       });
  //     }
  //   })();
  // };

  // sign out
  function signOut(req, res) {
    req.logout();
    if (req.session) req.session.destroy();
    res.clearCookie("connect.sid");
    debug("you are now logged out");
    // app.use(function (req, res, next) {
    //   if (!req.user)
    //     res.header(
    //       "Cache-Control",
    //       "private, no-cache, no-store, must-revalidate"
    //     );
    //   next();
    // });
    res.json({ msg: "logged out" });
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

  function addFollowing(req, res) {
    (async function update() {
      try {
        const username = req.params;
        const id = req.body.userId
        console.log('user', id, username)

        // const update = await User.findOne(username, { new: true }).exec()
        // console.log(update)

        User.findOneAndUpdate(username, { $addToSet: { following: id } })
          .then(user => {
            console.log('user', user)
            // user.followingCount = user.following.length+1

            // user.save().then(resp => {
            //   console.log('updated', resp.following, resp.followingCount)

            res.status(200).json(user)
            //})
            //.catch(err => console.log(`Oops! ${err.stack}`))
          })
          .catch(err => console.log(`Oops! ${err.stack}`))
      } catch (err) {
        debug(err.stack)
      }
    }());
  }

  return {
    signUpWithEmail,
    signOut,
    getUser,
    addFollowing
  };
}

module.exports = userController;


exports.me = asyncHandler(async (req, res, next) => {
  const { avatar, username, fullname, email, _id, website, bio } = req.user;

  res
    .status(200)
    .json({
      success: true,
      data: { avatar, username, fullname, email, _id, website, bio },
    });
});
