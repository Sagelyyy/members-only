const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

// Setup Multer destination
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

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
router.get("/user/:id", userController.user_detail);
router.post("/user/:id", upload.single("file"), userController.user_update);

// Message Routes
router.get("/new-post", postController.create_post_get);
router.post("/new-post", postController.create_post_post);

module.exports = router;
