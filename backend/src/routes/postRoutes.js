const express = require("express");
const postRouter = express.Router();
const postsController = require('../controllers/postController')


function router() {

  const { isUserSignedIn, getPosts, getPostById, addPost, deletePost } = postsController()

  // Check if user is logged in 
  postRouter.use(isUserSignedIn);


  postRouter.route("/").get(getPosts).post(addPost);
  // router.route("/search").get(searchPost);
  postRouter.route("/:id").get(getPostById).delete(deletePost);
  // router.route("/:id/togglelike").get(protect, toggleLike);
  // router.route("/:id/togglesave").get(protect, toggleSave);
  // router.route("/:id/comments").post(protect, addComment);
  // router.route("/:id/comments/:commentId").delete(protect, deleteComment);

  return postRouter
}

module.exports = router
