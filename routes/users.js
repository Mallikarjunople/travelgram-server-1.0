const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const UserController = require("../Controllers/users");

//get all users...
router.get("/", UserController.GetAllUsers);

//get user by id...
router.get("/:userId", checkAuth, UserController.GetUserById);

//update user by id...
router.patch("/:userId", checkAuth, UserController.UpdateUserById);

//delete user by id...
router.delete("/:userId", checkAuth, UserController.DeleteUserById);

module.exports = router;
