   
  const mongoose = require("mongoose");

  // database connectvity 


  const URI = process.env.DB_URI;

  async function DataConnect(){
 
    await  mongoose.connect(URI).then((data)=>{
               console.log("add databse success",data.connection.host);
    });
 } 
 module.exports=DataConnect;
 