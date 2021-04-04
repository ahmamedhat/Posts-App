const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: { type: String, required: true}
});

module.exports = mongoose.model("Post", postsSchema);


/* NOTE: mongoose validation is not working properly you must look back at that!!! */
