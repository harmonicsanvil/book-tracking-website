const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    isVerified: Boolean,
  });;

module.exports = mongoose.model("User", userSchema);
