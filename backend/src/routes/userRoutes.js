const express = require("express");
const userRouter = express.Router();
const usersController = require('../controllers/usersController')


function router() {

  const { isUserSignedIn, getUser, getUsers } = usersController()

  // Check if user is logged in 
  userRouter.use(isUserSignedIn);


  userRouter.route("/").get(getUsers);
  // userRouter.route("/").put(protect, editUser);
  // userRouter.route("/feed").get(protect, feed);
  // userRouter.route("/search").get(searchUser);
  userRouter.route("/:username").get(getUser);
  // userRouter.route("/:id/follow").get(protect, follow);
  // userRouter.route("/:id/unfollow").get(protect, unfollow);

  return userRouter
}

module.exports = router;
