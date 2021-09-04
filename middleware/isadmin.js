const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser=require('body-parser');
const User = require('../models/user');




module.exports = async(req, res, next) => {
    const id = req.userData.userId;
    
    const nuser =await  User.findOne({_id:id}).exec();
    if(nuser.role != 'admin'){
        return res.status(403).json({
            message:'You are not admin'
        });
    }

    next();
};