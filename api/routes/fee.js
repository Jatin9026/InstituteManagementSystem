const express= require("express");
const checkAuth = require("../middleware/checkAuth");
const router= express.Router();
const jwt=require("jsonwebtoken")
const Fee=require("../model/fee");
const { default: mongoose } = require("mongoose");
//signup---->post--->data client se bhejna
router.post("/add-fee",checkAuth,(req,res)=>{
      const token=req.headers.authorization.split(" ")[1];
        const verifiedToken=jwt.verify(token,process.env.JWT_SECRET);
        const newFee=new Fee({
            _id:new mongoose.Types.ObjectId,
            fullName:req.body.fullName,
            phone:req.body.phone,
            amount:req.body,amount,
            remark:req.body.remark,
            courseId:req.body.courseId,
            uId:{type:String,required:true}
        })
        newFee.save().then(res=>{
            res.status(200).json({
                newfee:res
            })
        }).catch(err=>{
            res.status(400).json({
                msg:"errorr internal"
            })
        })
})
module.exports=router;
