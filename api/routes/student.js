const express= require("express")
const router= express.Router();

//signup---->post--->data client se bhejna
router.post("/add-student",(req,res)=>{
    res.status(200).json({
        msg:"studetn addsed"
    })
})
module.exports=router;
