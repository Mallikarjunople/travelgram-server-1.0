const express = require("express");
const postController = require("../Controllers/post");
const router = express.Router();
const Post = require("../models/Post");
router.get("/", postController.getPosts);

//   router.get('/specific',function(req,res){
//     res.send("specific posts");
//   });

router.post("/", postController.createNewPost);

router.get("/:postId", postController.getPostsById);

router.delete("/:postId", postController.deletePostById);

router.patch("/:postId", postController.updatePostById);

module.exports = router;
