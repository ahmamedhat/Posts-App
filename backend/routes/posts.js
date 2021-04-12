const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const postController = require("../controllers/post");
const fileUpload = require("../middleware/file");

router.post("", checkAuth, fileUpload, postController.createPost);

router.put("/:id", checkAuth, fileUpload, postController.updatePost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
