const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    phone:{type:Number,required:true},
    password:{type:String,required:true},
    profilePhoto:{type:String},
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
      }],
      role:{
          type:String,
          default:"user"
        }
});

module.exports = mongoose.model('User',userSchema);