const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.user_create_get = (req, res, next) => {
  res.render("sign-up", {
    title: "Sign up",
  });
};

exports.user_create_post = [
  body("email", "Email must not be empty")
    .trim()
    .isLength({ min: 1 }, { max: 10 })
    .escape(),
  body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 }, { max: 10 })
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up", {
        title: "Sign up",
        errors: errors.array(),
      });
      return;
    }
    if (req.body.password === req.body.password_confirm) {
      bcrypt.hash(req.body.password, 10, (err, hashPass) => {
        if (err) {
          return next(err);
        }
        const user = new User({
          username: req.body.username,
          password: hashPass,
          email: req.body.email,
          avatar: `/images/default.png`,
        }).save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      });
    } else {
      throw new Error("Passwords must match");
    }
  },
];

exports.user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.user_detail = (req, res, next) => {
  async.parallel(
    {
      findUser(callback) {
        User.findById(req.params.id).exec(callback);
      },
      findPosts(callback) {
        Post.countDocuments({ user: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (req.user) {
        if (req.user._id.toString() == req.params.id) {
          res.render("user-update", {
            title: `Update your profile`,
            user: req.user,
            post_count: results.findPosts,
          });
        } else {
          res.render("user-detail", {
            title: `${results.findUser.username}'s Profile`,
            profile: results.findUser,
            user: req.user,
            post_count: results.findPosts,
          });
        }
      } else {
        res.render("user-detail", {});
      }
    }
  );
};

exports.user_update = [
  body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (req.user) {
        if (req.user._id.toString() == req.params.id) {
          res.render("user-update", {
            title: `Update your profile`,
            user: req.user,
            errors: errors.array(),
          });
        } else {
          res.render("user-detail", {
            title: `${user.username}'s Profile`,
            user: req.user,
          });
        }
      } else {
        res.render("user-detail", {});
      }
    }
    if (req.file) {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            username: req.body.username,
            avatar: `/images/${req.file.filename}`,
          },
        },
        { returnDocument: "after" },
        (err, doc) => {
          if (err) {
            return next(err);
          }
          res.redirect(doc.url);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            username: req.body.username,
          },
        },
        { returnDocument: "after" },
        (err, doc) => {
          if (err) {
            return next(err);
          }
          res.redirect(doc.url);
        }
      );
    }
  },
];
