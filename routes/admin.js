const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../Controllers/admin");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });
// use react-cloudinary for images..

router.get("/blogreq", adminController.GetAllBlogRequest);

router.get("/blogreq/:blogId", adminController.GetBlogRequestById);

router.patch("/blogreq/:blogId", adminController.UpdateBlogRequestById);

router.post("/addCity", adminController.AddCity);

router.post("/addCity/popularPlace", adminController.AddPopularPlace);

router.get("/addCity", adminController.GetAllCity);

router.get("/addCity/:location", adminController.GetCityByLocation);

router.get("/popularPlace/:placeId", adminController.GetPopularPlaceById);

router.delete("/popularPlace/:placeId", adminController.DeletePopularPlaceById);

router.get("/feedback", adminController.GetAllFeedback);

router.get("/feedback/:feedbackId", adminController.GetFeedbackById);

router.delete("/feedback/:feedbackId", adminController.DeleteFeedbackById);

module.exports = router;
