const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort([["timestamp", "descending"]])
      .populate("user");
    res.render("index", { user: req.user, posts });
  } catch (err) {
    return next(err);
  }
});

// User Routes
router.get("/sign-up", userController.user_create_get);
router.post("/sign-up", userController.user_create_post);
router.post("/log-in", userController.user_login_post);
router.get("/log-out", userController.user_logout);

// Message Routes
router.get("/new-post", postController.create_post_get);
router.post("/new-post", postController.create_post_post);

module.exports = router;
