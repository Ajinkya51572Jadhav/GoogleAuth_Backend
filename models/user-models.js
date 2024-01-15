

const jsonwebToken = require("jsonwebtoken");
const mongoose = require("mongoose");

//  user schema

const userSchema = new mongoose.Schema({
    name:{
     type:String ,
     require:[true,"Enter a userName"]
    },
    email:{
     type:String,
     require:true,
    },
    phone:{
      type:String,
      require:true,
    },
    password:{
      type:String,
      require:true,
      minLength:[8,"plese 8 password"],
    },
    isAdmin:{
      type:Boolean,
      default:false, 
    },
    createAt:{
      type:Date,
      default:Date.now
    }
});



// json Web Token generate 
           //  auto generate methods function generateToken    
//                               |
    userSchema.methods.generateToken=function(){
    // console.log("this is json web token",this);
    
    try {
   
      // payload json verify token
      return jsonwebToken.sign({
           userId:this._id.toString(),
           email:this.email,
           isAdmin:this.isAdmin
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn:"30d"
      }
      
      );
      
    } catch (error) {
     console.error(error);
      res.json({msg:error.message}).status(400);
    }
    };

  // model                       //  collection name

const User =  new mongoose.model("User",userSchema);

module.exports =User;
