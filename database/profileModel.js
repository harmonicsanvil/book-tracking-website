const mongoose = require("mongoose");
const profileSchema = require("./profileSchema");
 
let model;

function set (username) {
  model = mongoose.model(username, profileSchema);
  }

function get () {
  return model;
}
module.exports = {
  set,
  get,
}