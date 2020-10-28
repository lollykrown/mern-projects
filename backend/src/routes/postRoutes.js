const express = require("express");
const postRouter = express.Router();
const postsController = require('../controllers/postController')


function router() {

  const { isUserSignedIn, getPosts, getPostById, addPost, deletePost, addComment } = postsController()

  // Check if user is logged in 
  postRouter.use(isUserSignedIn);


  postRouter.route("/").get(getPosts).post(addPost);
  // postRouter.route("/search").get(searchPost);
  postRouter.route("/:id").get(getPostById).delete(deletePost);
  // postRouter.route("/:id/togglelike").get(protect, toggleLike);
  // routpostRouterer.route("/:id/togglesave").get(protect, toggleSave);
  postRouter.route("/:id/comments").post(addComment);
  // postRouter.route("/:id/comments/:commentId").delete(protect, deleteComment);

  return postRouter
}

module.exports = router
