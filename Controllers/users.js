const User = require("../models/user");
const jwt_decode = require("jwt-decode");

exports.GetAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("name email phone _id password");
    const response = {
      count: allUsers.length,
      users: allUsers.map((allUsers) => {
        return {
          name: allUsers.name,
          email: allUsers.email,
          phone: allUsers.phone,
          password: allUsers.password,
          _id: allUsers._id,
          // request: {
          //   type: "GET",
          //   url: baseUrl.link + "users/" + allUsers._id,
          // },
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.GetUserById = async (req, res) => {
  const id = req.params.userId;
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt_decode(token);
  // console.log(req.userData);
  if (req.userData.userId === id) {
    try {
      const userById = await User.findById(id).select(
        "name email phone _id password blogs role"
      );
      // console.log(userById);
      if (userById) {
        res.status(200).json({
          user: userById,
          // request: {
          //   type: "GET",
          //   url: baseUrl.link + "users",
          // },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  } else {
    res.status(404).json({
      message: "Not same user",
    });
  }
};

exports.UpdateUserById = async (req, res) => {
  const id = req.params.userId;
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt_decode(token);

  if (req.userData.userId === id) {
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    try {
      const updatedUser = await User.updateOne(
        { _id: id },
        { $set: updateOps }
      );
      res.status(200).json({
        message: "User updated",
        user: updatedUser,
        //   request: {
        //     type: "GET",
        //     url: baseUrl.link + "users/" + id,
        //   },
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
};

exports.DeleteUserById = async (req, res) => {
  const id = req.params.userId;
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt_decode(token);
  if (req.userData.userId === id) {
    try {
      const removedUser = await User.remove({ _id: req.params.userId });
      res.status(200).json({
        message: "User deleted",
        // request: {
        //   // type: "POST",
        //   // url: baseUrl.link + "users",
        //   body: {
        //     name: "String",
        //     email: "String",
        //     phone: "Number",
        //     password: "String",
        //   },
        // },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  }
};
