

  //  dot-env file insert in path
  require("dotenv").config({path:"./utils/.env"});

  const express =require("express");
  const cors = require("cors"); 
  const bodyParser = require("body-parser");
  const passport = require("passport");
  const OAuth2Strategy = require("passport-google-oauth2");
  const session  = require("express-session");
  const googleUser = require("./models/user-google");



  //   exports router 
  const DataConnect = require("./utils/database");

  const router = require("./router/auth-router");
  const contactrouter = require("./router/contact-route");
    
   const app = express();
      
   //    jevha client kadun data pass hoto tevha to json format madhi asto ani to backend madhe json 
  //    format madhi disava tyamule apan vaparato express.json() he middleware 
       

  //  middleware 
      app.use(cors()); 
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(express.json());
  

      app.use("/api/auth",router);
      app.use("/api/form",contactrouter);

       
      app.use(cors({
        origin:"https://login-905a9.web.app",
        methods:"GET,POST,PUT,DELETE",
        credentials:true
      }));



      app.use(express.json());

      //        setup session
      
             app.use(session({
              secret:"1234567890",
              resave:false,
              saveUninitialized:true
             }));

             // setpassport 
             app.use(passport.initialize());
             app.use(passport.session());


            //   google Authotication

             passport.use(
           new OAuth2Strategy({
                clientID:process.env.CLIENT_ID,
                clientSecret:process.env.CLIENT_SECRET,
                callbackURL:"/auth/google/callback",
                scope:["profile","email"],
              },
                     async(accessToken,refreshToken,profile,done)=>{
                      try {
                     let user = await googleUser.findOne({googleId:profile.id});
                           if(!user){
                               user=new googleUser({
                                googleId:profile.id,
                                displayName:profile.displayName,
                                email:profile.emails[0].value,
                                image:profile.photos[0].value
                               })
                               await user.save();
                           };
                           
                             return done(null,user);
                            } catch (error) {
                          return done(error,null);
                      };
                     }  
            )
             )


              passport.serializeUser((user,done)=>{
                  done(null,user);        
              })
   

              passport.deserializeUser((user,done)=>{
                done(null,user);        
            })
 
              app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}))

              app.get("/auth/google/callback",passport.authenticate("google",{
                successRedirect:"https://login-905a9.web.app",
                failureRedirect:"https://login-905a9.web.app/*"
              }))

              
              app.get("/login/success",async(req,res)=>{
                // console.log("req.user",req.user);
                   const googledata =  await googleUser.find();
                  res.json({message:"user Login",user:googledata}).status(200);
              });





// Database connect
  DataConnect().then(()=>{
  console.log("database connect successfully");
 }).catch((err)=>{
 console.log("server database fail",err); 
  process.exit(0);
});


// port 
    app.listen(process.env.PORT,()=>{
        console.log("port successfully",process.env.PORT);
    });
