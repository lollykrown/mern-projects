const express = require("express");
const postRouter = express.Router();
const postsController = require('../controllers/postsController')


function router() {

  const { isUserSignedIn, getPosts, getPostById } = postsController()

  // Check if user is logged in 
  postRouter.use(isUserSignedIn);


  postRouter.route("/").get(getPosts) //.post(protect, addPost);
  // router.route("/search").get(searchPost);
  postRouter.route("/:id").get(getPostById) //.delete(protect, deletePost);
  // router.route("/:id/togglelike").get(protect, toggleLike);
  // router.route("/:id/togglesave").get(protect, toggleSave);
  // router.route("/:id/comments").post(protect, addComment);
  // router.route("/:id/comments/:commentId").delete(protect, deleteComment);

  return postRouter
}

module.exports = router
