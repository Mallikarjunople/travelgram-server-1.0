const express = require("express");
const router = express.Router();
const cityController = require("../Controllers/Cities");
const checkAuth = require("../middleware/check-auth");

router.get("/:location", cityController.GetLocation);

router.get("/popularPlace/:placeId", cityController.GetPopularPlace);

module.exports = router;
