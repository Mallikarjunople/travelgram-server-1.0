const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    
    Title:{
        type:String,
        required:true
    },
    Location:{
        type:String,
        required:true
    },
    Desc:{
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
    popularcities:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PCity'
      }]
    
});

module.exports = mongoose.model('City',CitySchema);