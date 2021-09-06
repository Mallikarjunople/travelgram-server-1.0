const mongoose = require("mongoose");
const feedBack = require("../models/feedback");

exports.GetFeedback = async (req, res) =>{
    const feedback = new feedBack({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
      });
    
      try {
        const savedPost = await feedback.save();
        res.json(savedPost);
      } catch (err) {
        res.json({ message: err });
      }
}