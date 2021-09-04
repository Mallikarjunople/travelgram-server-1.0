const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
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
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model('Blog',blogSchema);