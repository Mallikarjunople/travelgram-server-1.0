const PBlog = require("../models/pendingBlog");

exports.GetTags = async (req, res) => {
  try {
    const tagblog = await PBlog.find({
      Tags: req.params.tags,
      flag: 1,
    }).populate("user", "_id name email");
    res.status(200).json({
      count: tagblog.length,
      blogs: tagblog.map((tagblog) => {
        return {
          _id: tagblog._id,
          Body: tagblog.Body,
          Location: tagblog.Location,
          Title: tagblog.Title,
          Pictures: tagblog.Pictures,
          Tags: tagblog.Tags,
          date: tagblog.date,
          // request: {
          //   type: "GET",
          //   url: baseUrl.link + "admin/addCity/" + tagblog._id,
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
