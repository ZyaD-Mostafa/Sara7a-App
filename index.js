import express from "express";
import  bootstrap  from "./src/app.controller.js";
import dotenv from "dotenv";
dotenv.config({path:"./src/config/.env.dev"});
const app = express();
const port = process.env.PORT || 5000 ; 

console.log(process.env.APPLAICTION_NAME);
await bootstrap (app ,express)


app.listen( port, () => {
    console.log("Server is running on port" , Number(port));
});



// deploy Sara7a App 


//ec2-13-51-205-98.eu-north-1.compute.amazonaws.com