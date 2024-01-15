const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
  });

  const Contact = new mongoose.model("contact",userSchema); 

  module.exports=Contact; 