const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");

exports.create_post_get = (req, res, next) => {
  res.render("new-post", {
    title: "Create a new post",
    user: req.user,
  });
};

exports.create_post_post = [
  body("title", "Title must not be empty")
    .trim()
    .escape()
    .isLength({ min: 1 }, { max: 20 }),
  body("text", "Message body must not be empty")
    .trim()
    .escape()
    .isLength({ min: 1 }, { max: 500 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (req.user) {
      const newPost = new Post({
        title: req.body.title,
        text: req.body.text,
        user: req.user._id,
      });
      if (!errors.isEmpty()) {
        res.render("new-post", {
          title: "Create a new post",
          user: req.user,
          errors: errors.array(),
        });
        return;
      }
      newPost.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.delete_get = (req, res, next) => {
  if (req.user && req.user.admin == true) {
    Post.findById(req.params.id).exec(function (err, post) {
      if (err) {
        return next(err);
      }
      res.render("delete-post", {
        user: req.user,
        post,
      });
    });
  } else {
    res.status(403).send("403 forbidden");
  }
};

exports.delete_post = (req, res, next) => {
  if (req.user && req.user.admin == true) {
    Post.findByIdAndRemove(req.body.postid, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
      return;
    });
  } else {
    res.status(403).send("403 forbidden");
  }
};
