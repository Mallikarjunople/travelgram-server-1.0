const mongoose = require('mongoose');

const pCitySchema = mongoose.Schema({
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
    City:{
        type:String,
        required:true
    }
    
});

module.exports = mongoose.model('PCity',pCitySchema);