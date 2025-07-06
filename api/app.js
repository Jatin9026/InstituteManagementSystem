const express = require('express');
//app ko express se banate hain
const app = express();
const mongoose = require("mongoose")
const bodyParser=require("body-parser")
const userrouter=require("./routes/user")
const studentrouter=require("./routes/student")
const courserouter=require("./routes/course")
const feerouter=require("./routes/fee");
const fileUpload = require('express-fileupload');
mongoose.connect("mongodb+srv://jatingupta918306:jatin%401415@cluster0.8aipfnp.mongodb.net/InstitueManagementSystem").then(()=>{
    console.log("mongodb connected")
}).catch(err=>{
console.log(err);
})
app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles:true,
    // tempFileDir:'/tmp/'
}))
//localhost3000 ke bad jis pe click karega vo js file callhoga
app.use("/user",userrouter);
app.use("/student",studentrouter)
app.use("/course",courserouter);
app.use("/fee",feerouter);
//in mese koe bhi route pe click nahi hua 
app.use((req,res)=>{
    res.status(400).json({
        msg:"Bad request"
    })
})
//app ko export karna
module.exports = app;