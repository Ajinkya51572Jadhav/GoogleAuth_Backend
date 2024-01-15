

const express =require("express");
  
const router = express.Router();

const {home,register, login, user, admin,userdelete,msgdelete} = require("../controllers/auth-controllers");
const jwtVerify = require("../middleware/auth-verfiy-jwt");

//   thiere are 3 stage of routing insert in the express 

// const app = express();
    
// app("",(req,res)=>{
//     res.json({
//         success:true
//      }).status(200);
// });

// router.get("/",(req,res)=>{
//   res.json({
//      success:true
//   }).status(200);
// });

// router.route("/register").get().post()


//  insert controllers 

//    Routers path

router.route("/home").get(home);
router.route("/register").post(register);
router.route("/login").post(login)
router.route("/user").get(jwtVerify,user);
router.route("/admin").get(admin);
router.route("/userdelete/:id").delete(userdelete);
router.route("/msgdelete/:id").delete(msgdelete);

module.exports=router; 



   