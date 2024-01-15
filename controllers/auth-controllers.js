
const bcryptjs = require("bcryptjs");
const User = require("../models/user-models");
const Contact = require("../models/contact-model");


// home 

const home=(req,res)=>{
   try {
    res.json({msg:"this is home page"}).status(200);
   } catch (error) {
     console.log(error);
      res.json({msg:error.message}).status(400);
   }
};


  // register    

  const register=async(req,res)=>{
     try {
// axis to client 
      //   console.log("req.body",req.body);
           const {name,email,phone,password} =req.body; 
     
      if(!name || !email || !phone  || !password){
      return  res.json({msg:"Invalid Validation"}).status(400);
      };
     
      if(!email.includes("@gmail.com")==true){
      return  res.json({msg:"Email Includes @gmail.com"}).status(400); 
      };

      if(!(phone.length==10)==true){
      return  res.send({msg:"Phone Number Must Be 10 "}).status(400); 
      }; 


      //   email are exist ya not in database 
           const userExist = await User.findOne({email:email});

              if(userExist){
                  return res.json({msg:"Email Already Exists"}).status(400);   
              }; 

                // hash the password  
                const saltRound = 10;
              const passwordHash = await bcryptjs.hash(password,saltRound);
               //  console.log(passwordHash);

                if(!passwordHash){
                  return res.json({msg:"Password Greater Then 8 Character"}).status(400);
                 };

          //  save database data 
              const userCreated =  await User.create({name,email,phone,password:passwordHash});
     
           res.json({
               msg:"user register successfully",
               token:await userCreated.generateToken(),
               userId:userCreated._id.toString()
              }).status(200);
   
          
     } catch (error) {
          console.log(error);
           res.json({
               error:error.message
           }).status(404);
     }
  };


  //  login

  const login = async(req,res)=>{
    try{
      
      const {email,password}=req.body;
     
      if(!email ||  !password){
        return res.json({msg:"Invalid Validation"}).status(400);
     }
 
       const emailExist = await User.findOne({email:email});

             if(!emailExist){
              return res.json({msg:"Email is Not Found"}).status(401);
           };

          //  password compare
             const isPassword = await bcryptjs.compare(password,emailExist.password);
           
           if(!isPassword){
            return res.json({msg:"isPassword is not Found"}).status(401);
          };


      res.json({
         msg:"user login successfully",
         token:await emailExist.generateToken(), 
         userId:emailExist._id.toString()
      }).status(200);


    }catch(error){
     console.error(error);
      res.json({
        error:error.message
      }).status(400);
    }

  };



  //  contact

  const contact=async(req,res)=>{
    try {
      const {user,email,message}=req.body;
        
           if(!user || !email || !message){
            return res.json({msg:"Invalid Validation" }).status(400);
           };

           if(!email.includes("@gmail.com")==true){
          return  res.json({msg:"Email Includes @gmail.com"}).status(400);
           }

      await Contact.create({user,email,message});
       res.json({msg:"Message Send SuccessFully"}).status(200);

    } catch(error){
       res.json({msg:error.message}).status(400);
    };
    
  };

//  send user  token in forntend
   const user =async(req,res)=>{
  //  console.log('res.user',req.user);
      const userData = req.user;
try {
  
  res.json({userData}).status(200);

} catch (error) {
  res.json({msg:error.message}).status(400);
}
   };

  //   admin 
   
//  send user  token in forntend
const admin =async(req,res)=>{

  try {
  const adminData = await User.find();
  const ContactData = await Contact.find();

res.json({adminData:adminData,ContactData:ContactData}).status(200);

} catch (error) {
res.json({msg:error.message}).status(400);
}
    
 };
   


//  delete data

  

const userdelete=async(req,res)=>{
       try {
        const id =req.params.id;
        if(!id){
          return res.json({msg:`Id ${req.params.id} is Not Found`}).status(401);
       };         
        const userId = await User.findById({_id:id});  
        if(!userId){
         return res.json({msg:`Id ${req.params.id} is Not Found`}).status(401);
      };
          await userId.deleteOne();

        res.json({
          msg:"Delete User SuccessFully",
        }).status(400);

       } catch (error) {
       console.log(error);
       res.json({msg:error.message}).status(400);
      }
}


const msgdelete=async(req,res)=>{
  try {
    const id =req.params.id;
    if(!id){
      return res.json({msg:`Id ${req.params.id} is Not Found`}).status(401);
   };         
    const msgId = await Contact.findById({_id:id});
    if(!msgId){
     return res.json({msg:`Id ${req.params.id} is Not Found`}).status(401);
  };
      await msgId.deleteOne();
   res.json({
     msg:"Delete Contact MSG SuccessFully",
   });
  } catch (error) {
  console.log(error);
  res.json({msg:error.message}).status(400);
}
}

  module.exports={home,register,login,contact,user,admin,userdelete,msgdelete};   
  