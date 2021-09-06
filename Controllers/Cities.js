const City = require("../models/City");
const PCity = require("../models/popularcities");

exports.GetLocation = async (req, res) => {
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
          // request: {
          //   type: "GET",
          //   url: baseUrl.link + "admin/addCity/" + allCity._id,
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

exports.GetPopularPlace = async (req, res) => {
  try {
    const popularPlace = await PCity.findById(req.params.placeId);
    res.status(200).json(popularPlace);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
