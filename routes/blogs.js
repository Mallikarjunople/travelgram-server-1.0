const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const blogController = require("../Controllers/blogs");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

//Get All Blogs
router.get("/", checkAuth, blogController.GetAllBlogs);

// Post A Blog
router.post("/", checkAuth, blogController.PostBlog);

// Get "Approved" Blog by Id --- this api will work only when blog is approved..
router.get("/:blogId", checkAuth, blogController.GetBlogById);

// Update "Approved" Blog By Id
router.patch("/:blogId", checkAuth, blogController.UpdateBlogById);

// Delete "Approved" Blog By Id
router.delete("/:blogId", checkAuth, blogController.DeleteBlogById);

module.exports = router;
