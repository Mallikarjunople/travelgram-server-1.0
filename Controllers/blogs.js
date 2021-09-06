const mongoose = require("mongoose");
const User = require("../models/user");
const jwt_decode = require("jwt-decode");
const PBlog = require("../models/pendingBlog");

exports.GetAllBlogs = async (req, res) => {
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
          // request: {
          //   type: "GET",
          //   url: baseUrl.link + "blogs/" + allBlogs._id,
          // },
        };
      }),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.PostBlog = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt_decode(token);
//  console.log("*******")
//   console.log(res.body);

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
        Pictures: req.body.Pictures,
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
            // type: "GET",
            pendingblog: npblog,
            // url: baseUrl.link + "blogs/" + npblog._id,
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
};

exports.GetBlogById = async (req, res) => {
  try {
    const findBlog = await PBlog.findById(req.params.blogId).populate("user");

    if (!findBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
      
    }
    // console.log("work...");
    // console.log(findBlog);  we are not getting blog , bcz it is not approved till now

    // const uId = findBlog.user.blogs;
    //uid = 61353ff85a76d99814eb65b4
    // req.params.blogId = 61366e19646b409af8c5ddbe
    // console.log("uid" + uId);

    // var flag = false;

    // for (var i = 0; i < uId.length; i++) {
    //   if (uId[i] == req.params.blogId) {
    //     flag = true;
    //     break;
    //   }
    // }

    // if (flag) {
      res.status(200).json({
        blog: findBlog,
        // request: {
        //   type: "GET",
        //   url: baseUrl.link + "blogs",
        // },
      });
    // } else {
      // res.status(500).json({
      //   mesaage: "Blog doesn't belong to you",
      // });
    // }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.UpdateBlogById = async (req, res) => {
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
        // request: {
        //   type: "GET",
        //   url: baseUrl.link + "users/" + id,
        // },
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
};

exports.DeleteBlogById = async (req, res) => {
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
                  // request: {
                  //   type: "POST",
                  //   url: baseUrl.link + "blogs",
                  // },
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
};
