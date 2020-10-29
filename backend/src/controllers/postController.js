const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

function postsController() {

  function isUserSignedIn(req, res, next) {
    if (req.user) {
      console.log(req.isAuthenticated())
      // console.log(req.isUnAuthenticated())
      console.log('You are logged in')
      console.log(req.cookies)
      next();
    } else {
      // You are not logged in
      console.log('You need to log in first')
      res.status(400).json({ status: false, message: 'You need to log in first' })
    }
  }

  function getPosts(req, res) {
    (async function post() {
      try {
        const posts = await Post.find({})
          .sort({ createdAt: -1 })
          .populate({
            path: "comments",
            select: "text",
            populate: {
              path: "user",
              select: "username avatar",
            },
          })
          .populate({ path: 'user', select: 'avatar username' }).exec();

        res.status(200).json({
          status: true,
          success: true,
          data: posts
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function getPostById(req, res) {
    (async function get() {
      try {
        const post = await Post.findById(req.params.id)
          .populate({
            path: "comments",
            select: "text",
            populate: {
              path: "user",
              select: "username avatar",
            },
          })
          .populate({
            path: "user",
            select: "username avatar",
          })
          .lean()
          .exec();


        if (!post) {
          return next({
            message: `No post found for id ${req.params.id}`,
            statusCode: 404,
          });
        }

        // is the post belongs to loggedin user?
        post.isMine = req.user.id === post.user._id.toString();

        // is the loggedin user liked the post??
        const likes = post.likes.map((like) => like.toString());
        post.isLiked = likes.includes(req.user.id);

        // is the loggedin user liked the post??
        const savedPosts = req.user.savedPosts.map((post) => post.toString());
        post.isSaved = savedPosts.includes(req.params.id);

        // is the comment on the post belongs to the logged in user?
        post.comments.forEach((comment) => {
          comment.isCommentMine = false;

          const userStr = comment.user._id.toString();
          if (userStr === req.user.id) {
            comment.isCommentMine = true;
          }
        });

        res.status(200).json({ success: true, data: post });

      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    })();
  }

  function addPost(req, res) {
    (async function add() {
      try {
        const { caption, files, tags } = req.body;
        const user = req.user.id;

        let post = await Post.create({ caption, files, tags, user });

        await User.findByIdAndUpdate(req.user.id, {
          $push: { posts: post._id },
          $inc: { postCount: 1 },
        });

        post = await post
          .populate({ path: "user", select: "avatar username fullname" })
          .execPopulate();

        res.status(200).json({
          status: true,
          data: post
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function deletePost(req, res) {
    (async function post() {
      try {
        const post = await Post.findById(req.params.id);

        if (!post) {
          return res.status(404).json({
            message: `No post found for id ${req.params.id}`,
            status: false,
          });
        }

        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            message: "You are not authorized to delete this post",
            status: false,
          });
        }

        await User.findByIdAndUpdate(req.user.id, {
          $pull: { posts: req.params.id },
          $inc: { postCount: -1 },
        });

        await post.remove();

        res.status(200).json({
          status: true,
          data: {}
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function addComment(req, res) {
    (async function post() {
      try {
        const post = await Post.findById(req.params.id);

        if (!post) {
          return res.status(404).json({
            message: `No post found for id ${req.params.id}`,
            status: false,
          });
        }

        let comment = await Comment.create({
          user: req.user.id,
          post: req.params.id,
          text: req.body.text,
        });

        post.comments.push(comment._id);
        post.commentsCount = post.commentsCount + 1;
        await post.save();

        comment = await comment
          .populate({ path: "user", select: "avatar username fullname" })
          .execPopulate();

        res.status(200).json({
          status: true,
          data: comment
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function toggleLike(req, res) {
    (async function post() {
      try {
        // make sure that the post exists
        const post = await Post.findById(req.params.id);

        if (!post) {
          return res.status(404).json({
            message: `No post found for id ${req.params.id}`,
            status: false
          });
        }

        if (post.likes.includes(req.user.id)) {
          const index = post.likes.indexOf(req.user.id);
          post.likes.splice(index, 1);
          post.likesCount = post.likesCount - 1;
          await post.save();
        } else {
          post.likes.push(req.user.id);
          post.likesCount = post.likesCount + 1;
          await post.save();
        }

        res.status(200).json({
          status: true,
          data: {}
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function deleteComment(req, res) {
    (async function del() {
      try {
        const post = await Post.findById(req.params.id);

        if (!post) {
          return res.status(404).json({
            message: `No post found for id ${req.params.id}`,
            status: false,
          });
        }

        const comment = await Comment.findOne({
          _id: req.params.commentId,
          post: req.params.id,
        });

        if (!comment) {
          return res.status(404).json({
            message: `No comment found for id ${req.params.id}`,
            status: false,
          });
        }

        if (comment.user.toString() !== req.user.id) {
          return res.status(401).json({
            message: "You are not authorized to delete this comment",
            status: false,
          });
        }

        // remove the comment from the post
        const index = post.comments.indexOf(comment._id);
        post.comments.splice(index, 1);
        post.commentsCount = post.commentsCount - 1;
        await post.save();

        await comment.remove();

        res.status(200).json({
          status: true,
          data: {}
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function searchPost(req, res) {
    (async function del() {
      try {
        if (!req.query.caption && !req.query.tag) {
          return res.status(400).json({
            message: "Please enter either caption or tag to search for",
            status: false,
          });
        }

        let posts = [];

        if (req.query.caption) {
          const regex = new RegExp(req.query.caption, "i");
          posts = await Post.find({ caption: regex });
        }

        if (req.query.tag) {
          posts = posts.concat([await Post.find({ tags: req.query.tag })]);
        }

        res.status(200).json({
          status: true,
          data: posts
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  function toggleSave(req, res) {
    (async function del() {
      try {
        // make sure that the post exists
        const post = await Post.findById(req.params.id);

        if (!post) {
          return res.status(404).json({
            message: `No post found for id ${req.params.id}`,
            status: false,
          });
        }

        const { user } = req;

        if (user.savedPosts.includes(req.params.id)) {
          console.log("removing saved post");
          await User.findByIdAndUpdate(user.id, {
            $pull: { savedPosts: req.params.id },
          });
        } else {
          console.log("saving post");
          await User.findByIdAndUpdate(user.id, {
            $push: { savedPosts: req.params.id },
          });
        }

        res.status(200).json({
          status: true,
          data: {}
        });
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    })();
  }

  return {
    isUserSignedIn,
    getPosts,
    getPostById,
    addPost,
    deletePost,
    addComment,
    toggleLike,
    deleteComment,
    searchPost,
    toggleSave
  };
}

module.exports = postsController
