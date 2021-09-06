const User = require("../models/user")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

exports.UserLogin =  async (req,res) => {
    await User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Password don't match",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "secret",
            {
              expiresIn: "10h",
            }
          );
          var decoded = jwt_decode(token);

          return res.status(200).json({
            message: "Auth successful",
            token: token,
            userId: decoded.userId,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.UserRegister =  async (req,res) => {
    User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err,
            });
          } else {
            // console.log(req.file);
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              password: hash,
              profilePhoto: req.body.profilePhoto,
            });
            user
              .save()
              .then((result) => {
                // console.log(result);

                // var transporter = nodemailer.createTransport({
                //   service: "gmail",
                //   auth: {
                //     user: "dukedummont@gmail.com",
                //     pass: "Vaibhav@1999",
                //   },
                // });

                // var mailOptions = {
                //   from: "dukedummont@gmail.com",
                //   to: user.email,
                //   subject: "Successful Registration",
                //   text: `Greetings,
                //             You have successfully registered an account at Travelgram.We look forward to hearing stories from you
                //                                        -Team Travelgram`,
                // };

                // transporter.sendMail(mailOptions, function (error, info) {
                //   if (error) {
                //     console.log(error);
                //   } else {
                //     console.log("Email sent: " + info.response);
                //   }
                // });

                res.status(201).json({
                  message: "User created successfully",
                  doc: result
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};