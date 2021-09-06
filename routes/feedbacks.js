const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const feedbackController = require("../Controllers/feedback");

router.post("/", checkAuth, feedbackController.GetFeedback);

module.exports = router;
