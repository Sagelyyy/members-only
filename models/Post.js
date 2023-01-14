const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, minLength: 1, maxLength: 20 },
  text: { type: String, required: true, minLength: 1, maxLength: 500 },
  timestamp: { type: Date, default: Date.now, required: true },
});

PostSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("MM-dd-yyyy, HH:mm");
});

module.exports = mongoose.model("Post", PostSchema);
