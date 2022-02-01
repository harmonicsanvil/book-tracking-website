const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profileSchema = new Schema({
    books: [],
  });

  module.exports = profileSchema;
