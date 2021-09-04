const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt_decode = require("jwt-decode");
const Blog = require("../models/blog");
const checkAuth = require("../middleware/check-auth");
const PBlog = require("../models/pendingBlog");
const baseUrl = require("..");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const allBlogs = await PBlog.find({ flag: 1 }).populate(
      "user",
      "name email _id"
    );
    res.status(200).json({
      count: allBlogs.length,
      blogs: allBlogs.map((allBlogs) => {
        return {
          _id: allBlogs._id,
          user: allBlogs.user,
          Body: allBlogs.Body,
          Location: allBlogs.Location,
          Title: allBlogs.Title,
          Pictures: allBlogs.Pictures,
          date: allBlogs.date,
          flag: allBlogs.flag,
          request: {
            type: "GET",
            url: baseUrl.link + "blogs/" + allBlogs._id,
          },
        };
      }),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.post(
  "/",
  upload.single("Pictures"),
  checkAuth,
  async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt_decode(token);

    // console.log(req.userData.userId);
    // console.log(decoded.userId);
    if (req.userData.userId === decoded.userId) {
      try {
        const findUser = await User.findById(req.userData.userId);
        if (!findUser) {
          return res.status(404).json({
            message: "user not found",
          });
        }
        // console.log(findUser);
        // const nblog= new Blog({
        //     _id: new mongoose.Types.ObjectId(),
        //     Tags:req.body.Tags,
        //     user:req.userData.userId,
        //     Body:req.body.Body,
        //     Location:req.body.Location,
        //     Title:req.body.Title,
        //     Pictures:req.body.Pictures,
        //     date:req.body.date
        // });

        const pblog = new PBlog({
          _id: new mongoose.Types.ObjectId(),
          Tags: req.body.Tags,
          user: req.userData.userId,
          Body: req.body.Body,
          Location: req.body.Location,
          Title: req.body.Title,
          Pictures: req.file.path,
          date: req.body.date,
        });

        try {
          const npblog = await pblog.save();
          // console.log(npblog);

          // const createdBlog = await nblog.save();
          // console.log(createdBlog);

          // findUser.blogs.push(createdBlog._id);
          // await findUser.save();
          // console.log(findUser);
          res.status(201).json({
            message: "Blog blog sent for review",
            request: {
              type: "GET",
              pendingblog: npblog,
              url: baseUrl.link + "blogs/" + npblog._id,
            },
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        }
      } catch (err) {
        res.status(500).json({
          message: "User not found",
          error: err,
        });
      }
    } else {
      res.status(404).json({
        message: "You are not same user",
      });
    }
  }
);

router.get("/:blogId", checkAuth, async (req, res, next) => {
  try {
    const findBlog = await PBlog.findById(req.params.blogId).populate("user");

    if (!findBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    // console.log(findBlog);

    const uId = findBlog.user.blogs;

    var flag = false;

    for (var i = 0; i < uId.length; i++) {
      if (uId[i] == req.params.blogId) {
        flag = true;
        break;
      }
    }

    if (flag) {
      res.status(200).json({
        blog: findBlog,
        request: {
          type: "GET",
          url: baseUrl.link + "blogs",
        },
      });
    } else {
      res.status(500).json({
        mesaage: "Blog doesn't belong to you",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.patch("/:blogId", async (req, res, next) => {
  const id = req.params.blogId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  try {
    const updatedBlog = await PBlog.updateOne({ _id: id }, { $set: updateOps });
    res.status(200).json({
      message: "Blog updated",
      newBlog: updatedBlog,
      request: {
        type: "GET",
        url: baseUrl.link + "users/" + id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/:blogId", checkAuth, async (req, res, next) => {
  try {
    const findBlog = await PBlog.findById(req.params.blogId);
    if (findBlog == 0) {
      return res.status(404).json({
        message: "blog not found",
      });
    } else {
      const nuser = await User.findOne({ _id: findBlog.user }).exec();
      const blogsArray = nuser.blogs;
      // console.log(blogsArray);
      var flag = false;

      for (var i = 0; i < blogsArray.length; i++) {
        //console.log(blogsArray[i]);
        if (blogsArray[i] == req.params.blogId) {
          flag = true;
          blogsArray.splice(i, 1);
        }
      }
      // console.log(blogsArray);
      nuser.blogs = blogsArray;
      // console.log(nuser.blogs);
      await nuser.save();
      // console.log(nuser);
      if (flag) {
        // res.status(200).json({
        //     message:'Blog deleted',
        //     request:{
        //         type:'POST',
        //         url:'http://localhost:5000/blogs'
        //     }
        // });

        await PBlog.findByIdAndDelete(req.params.blogId, function (err, docs) {
          if (err) {
            res.status(500).json({
              message: "error deleting blog",
              error: err,
            });
          } else {
            res.status(200).json({
              message: "Blog deleted",
              doc: docs,
              request: {
                type: "POST",
                url: baseUrl.link + "blogs",
              },
            });
          }
        });
      } else {
        res.status(404).json({
          mesaage: "Blog doesn't belong to you",
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
