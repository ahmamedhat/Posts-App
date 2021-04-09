const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: { type: String, required: true},
  creatorId: { type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true }
});

module.exports = mongoose.model("Post", postsSchema);


