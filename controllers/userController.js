const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.user_create_get = (req, res, next) => {
  res.render("sign-up", {
    title: "Sign up",
  });
};

exports.user_create_post = (req, res, next) => {
  if (req.body.password === req.body.password_confirm) {
    bcrypt.hash(req.body.password, 10, (err, hashPass) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashPass,
        email: req.body.email,
        // set up multer
        // avatar: `./images/user/${req.file.filename}`
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
};

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
