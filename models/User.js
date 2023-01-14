const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const Email = new Schema({
  address: { type: String, lowercase: true, required: true },
});

const UserSchema = new Schema({
  username: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  email: { type: Email, required: true },
  avatar: { type: String },
  timestamps: true,
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

UserSchema.plugin(uniqueValidator, { message: "Username is taken" });

module.exports = mongoose.model("User", UserSchema);
