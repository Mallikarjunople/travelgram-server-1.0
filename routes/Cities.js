const express = require("express");
const router = express.Router();
const cityController = require("../Controllers/Cities");
const checkAuth = require("../middleware/check-auth");

router.get("/:location", checkAuth, cityController.GetLocation);

router.get("/popularPlace/:placeId", checkAuth, cityController.GetPopularPlace);

module.exports = router;
