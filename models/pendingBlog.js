const mongoose = require('mongoose');

const pblogSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        
    },
    Title:{
        type:String,
        required:true
    },
    Location:{
        type:String,
        required:true
    },
    Body:{
        type:String,
        required:true
    },
    Tags:{
        type:String,
        required:true
    },
    Pictures:{
        type:String
    },
    date: { type: Date, default: Date.now },
      flag:{
          type:Number,
          default:0
      }
});

module.exports = mongoose.model('PBlog',pblogSchema);