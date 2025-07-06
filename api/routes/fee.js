const express= require("express")
const router= express.Router();

//signup---->post--->data client se bhejna
router.post("/add-fee",(req,res)=>{
    res.status(200).json({
        msg:"fee added"
    })
})
module.exports=router;
