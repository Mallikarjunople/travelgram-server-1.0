const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt_decode = require("jwt-decode");
const PBlog = require("../models/pendingBlog");
const PCity = require("../models/popularcities");
const City = require("../models/City");
const feedBack = require("../models/feedback");
const nodemailer = require("nodemailer");
const multer = require("multer");
const isadmin = require("../middleware/isadmin");
const baseUrl = require("..");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/blogreq", async (req, res, next) => {
  try {
    const allpendingnewblogs = await PBlog.aggregate([{ $match: { flag: 0 } }]);

    const allpendingupdatedblogs = await PBlog.aggregate([
      { $match: { flag: 2 } },
    ]);

    var allpendingblogs = [];
    for (var i = 0; i < allpendingnewblogs.length; i++) {
      allpendingblogs.push(allpendingnewblogs[i]);
    }

    for (var i = 0; i < allpendingupdatedblogs.length; i++) {
      allpendingblogs.push(allpendingupdatedblogs[i]);
    }

    res.status(200).json({
      count: allpendingblogs.length,
      blogs: allpendingblogs.map((allpendingblogs) => {
        return {
          _id: allpendingblogs._id,
          user: allpendingblogs.user,
          Body: allpendingblogs.Body,
          Location: allpendingblogs.Location,
          Title: allpendingblogs.Title,
          flag: allpendingblogs.flag,
          Pictures: allpendingblogs.Pictures,
          date: allpendingblogs.date,
          request: {
            type: "GET",
            url: baseUrl.link + "blogs/" + allpendingblogs._id,
          },
        };
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

router.get("/blogreq/:blogId", async (req, res, next) => {
  try {
    const blog = await PBlog.findById(req.params.blogId);
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.patch("/blogreq/:blogId", async (req, res) => {
  try {
    const updatedBlog = await PBlog.updateOne(
      { _id: req.params.blogId },
      { $set: { flag: req.body.flag } }
    );

    const pblog = await PBlog.findById(req.params.blogId);
    // console.log(pblog);

    const findUser = await User.findById(pblog.user);
    // console.log(findUser);

    findUser.blogs.push(pblog._id);
    await findUser.save();
    // console.log(findUser);

    if (pblog.flag == 2) {
      // var transporter = nodemailer.createTransport({
      //     service: 'gmail',
      //     auth: {
      //       user: 'dukedummont@gmail.com',
      //       pass: 'Vaibhav@1999'
      //     }
      //   });

      //   var mailOptions = {
      //     from: 'dukedummont@gmail.com',
      //     to: findUser.email,
      //     subject: 'Regarding your blog on travelgram',
      //     text: `Greetings,
      //     We found that the blog that you have posted on our site contained graphic content and inappropriate information and did not meet the community guidelines.
      //     Your blog has been flaged  and a formal warning is being issued to you regarding this.Please make changes to your blog ot it will be deleted.
      //                                -Team Travelgram`
      //   };

      //   transporter.sendMail(mailOptions, function(error, info){
      //     if (error) {
      //       console.log(error);
      //     } else {
      //       console.log('Email sent: ' + info.response);
      //     }
      //   });

      // await PBlog.findByIdAndDelete(pblog._id,function(err,docs){
      //     if(err){

      //         res.status(500).json({
      //             message:'error deleting blog',
      //             error:err
      //         })
      //     }else{

      //         res.status(200).json({
      //             message:'inappropriate content,blog deleted',
      //             doc:pblog,
      //             request:{
      //                 type:'POST',
      //                 url: baseUrl.link + 'blogs'
      //             }
      //         });
      //     }
      // });

      res.status(200).json({
        message: "inappropriate content",
        doc: pblog,
        request: {
          type: "POST",
          url: baseUrl.link + "blogs",
        },
      });
    } else {
      // var transporter = nodemailer.createTransport({
      //     service: 'gmail',
      //     auth: {
      //       user: 'dukedummont@gmail.com',
      //       pass: 'Vaibhav@1999'
      //     }
      //   });

      //   var mailOptions = {
      //     from: 'dukedummont@gmail.com',
      //     to: findUser.email,
      //     subject: 'Regarding your blog on travelgram',
      //     text: `Greetings,
      //     The blog that you have written meets all the community guidelines and thank you for posting on our website .
      //     We look forward to hear more stories from you.
      //                                -Team Travelgram`
      //   };

      //   transporter.sendMail(mailOptions, function(error, info){
      //     if (error) {
      //       console.log(error);
      //     } else {
      //       console.log('Email sent: ' + info.response);
      //     }
      //   });

      res.status(200).json({
        message: "blog saved in db",
        bog: pblog,
      });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/addCity", upload.single("Pictures"), async (req, res, next) => {
  // console.log(req.file);
  const popularCity = new City({
    _id: new mongoose.Types.ObjectId(),
    Title: req.body.Title,
    Desc: req.body.Desc,
    Tags: req.body.Tags,
    Location: req.body.Location,
    Pictures: req.file.path,
  });

  try {
    const savedpopularCity = await popularCity.save();
    res.status(200).json({
      message: "new city added",
      city: savedpopularCity,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post(
  "/addCity/popularPlace",
  upload.single("Pictures"),
  async (req, res, next) => {
    //console.log(req.file);
    const newPlace = new PCity({
      _id: new mongoose.Types.ObjectId(),
      Title: req.body.Title,
      Desc: req.body.Desc,
      Tags: req.body.Tags,
      Location: req.body.Location,
      Pictures: req.file.path,
      City: req.body.City,
    });

    try {
      const addedCity = await newPlace.save();

      const findCity = await City.findOne({ Location: addedCity.City }).exec();

      //   console.log(findCity);

      findCity.popularcities.push(addedCity._id);
      // console.log(findCity.popularcities);

      try {
        const pcity = await findCity.save();
      } catch (err) {
        console.log(err);
      }
      // console.log(findCity.popularcities);

      res.status(200).json(addedCity);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  }
);

router.get("/addCity", async (req, res, next) => {
  try {
    const allCity = await City.find({}).populate(
      "popularcities",
      "_id Title Tags Location Pictures"
    );
    res.status(200).json({
      count: allCity.length,
      cities: allCity.map((allCity) => {
        return {
          _id: allCity._id,
          popularcities: allCity.popularcities,
          Desc: allCity.Desc,
          Location: allCity.Location,
          Title: allCity.Title,
          Pictures: allCity.Pictures,
          Tags: allCity.Tags,
          request: {
            type: "GET",
            url: baseUrl.link + "admin/addCity/" + allCity._id,
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

router.get("/addCity/:location", async (req, res, next) => {
  try {
    const allCity = await City.find({ Location: req.params.location }).populate(
      "popularcities",
      "_id Title Tags Location Pictures"
    );
    res.status(200).json({
      count: allCity.length,
      cities: allCity.map((allCity) => {
        return {
          _id: allCity._id,
          popularcities: allCity.popularcities,
          Desc: allCity.Desc,
          Location: allCity.Location,
          Title: allCity.Title,
          Pictures: allCity.Pictures,
          Tags: allCity.Tags,
          request: {
            type: "GET",
            url: baseUrl.link + "admin/addCity/" + allCity._id,
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

router.get("/popularPlace/:placeId", async (req, res, next) => {
  try {
    const popularPlace = await PCity.findById(req.params.placeId);
    res.status(200).json(popularPlace);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/popularPlace/:placeId", async (req, res, next) => {
  try {
    const popularPlace = await PCity.findById(req.params.placeId);
    if (popularPlace == 0) {
      return res.status(404).json({
        message: "Place not found",
      });
    } else {
      const foundCity = await City.findOne({ _id: popularPlace.City }).exec();
      const placesArray = foundCity.popularcities;
      // console.log(placesArray);
      var flag = false;

      for (var i = 0; i < placesArray.length; i++) {
        //console.log(blogsArray[i]);
        if (placesArray[i] == req.params.placeId) {
          flag = true;
          placesArray.splice(i, 1);
        }
      }
      // console.log(placesArray);
      foundCity.popularcities = placesArray;
      // console.log(foundCity.popularcities);
      await foundCity.save();
      // console.log(foundCity);
      if (flag) {
        // res.status(200).json({
        //     message:'Blog deleted',
        //     request:{
        //         type:'POST',
        //         url:'http://localhost:5000/blogs'
        //     }
        // });

        await PCity.findByIdAndDelete(req.params.placeId, function (err, docs) {
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
                url: baseUrl.link + "admin/addCity/popularPlace",
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

router.get("/feedback", async (req, res) => {
  // try{
  //   const feedbacks = await feedBack.find();
  //   res.staus(200).json(feedbacks);
  // }catch(err){
  //     res.json({message:err});
  // }

  try {
    const allfeedback = await feedBack.find();
    res.status(200).json({
      count: allfeedback.length,
      cities: allfeedback.map((allfeedback) => {
        return {
          _id: allfeedback._id,
          name: allfeedback.name,
          description: allfeedback.description,
        };
      }),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get("/feedback/:feedbackId", async (req, res) => {
  try {
    const feedback = await feedBack.findById(req.params.feedbackId);
    res.status(200).json(feedback);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/feedback/:feedbackId", async (req, res) => {
  try {
    const removedfeedback = await feedBack.remove({
      _id: req.params.feedbackId,
    });
    res.status(200).json(removedfeedback);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
