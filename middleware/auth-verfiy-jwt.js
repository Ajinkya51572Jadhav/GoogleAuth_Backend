



const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user-models");

              //  jwt verfiy token
           const jwtVerify = async(req,res,next)=>{
            
            try {
                        // client token 
                   const token = req.header("Authorization");
                 //    console.log(token);

                          if(!token){
                            return res.json({msg:"Token is not Found"}).status(401);
                          };

                          const jwtToken = token.replace("Bearer","").trim();
                          //  thire are same are not
                          const isVerify = jsonwebtoken.verify(jwtToken,process.env.JWT_SECRET_KEY);
                         //  console.log(isVerify);
                                                               // select  remain password sodun all data denar            
                           const userData = await  User.findOne({email:isVerify.email}).select({password:0});
                            
                                  //  console.log(userData);
                                    req.user = userData;
                                    req.token = token;
                                    req.userID= userData._id;

                         next();                
                     } catch (error) {
                       console.log(error);
                         res.json({msg:error.message}).status(401);
                     }
           };

           module.exports = jwtVerify;

    