const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const City = require("../models/City");
const PCity = require("../models/popularcities");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const jwt_decode = require("jwt-decode");
const baseUrl = require("..");

router.get("/:location", async (req, res, next) => {
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

module.exports = router;
