const express = require("express");
const userRouter = express.Router();
const userController = require('../controllers/userController')


function router() {

  const { isUserSignedIn, getUser, getUsers, follow, unfollow, feed, searchUser, editUser } = userController()

  // Check if user is logged in 
  userRouter.use(isUserSignedIn);

  userRouter.route('/').get(getUsers).put(editUser);
  userRouter.route("/feed").get(feed);
  userRouter.route("/search").get(searchUser);
  userRouter.route("/:username").get(getUser);
  userRouter.route("/:id/follow").get(follow);
  userRouter.route("/:id/unfollow").get(unfollow);

  return userRouter
}

module.exports = router;
