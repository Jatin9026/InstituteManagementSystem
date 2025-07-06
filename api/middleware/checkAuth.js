const jwt = require("jsonwebtoken")
module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        console.log(token)
        const verifiedToken=jwt.verify(token,process.env.JWT_SECRET)
        console.log(verifiedToken)
        next();
    }                                                                                                 
    catch(err){
        return res.status(401).json({
            msg:"invalid token"
        })
    }
}