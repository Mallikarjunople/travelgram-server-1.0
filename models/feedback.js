const mongoose = require('mongoose');

const FeedBackSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
        
    },
    
});


module.exports = mongoose.model('feedBack',FeedBackSchema);