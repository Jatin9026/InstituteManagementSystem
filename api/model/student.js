const mongoose=require("mongoose");
const studentSchema=new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    fullName:{type:String,required:true},
    phone:{type:Number,required:true},
    email:{type:String,required:true},
    address:{type:String,required:true},
    imageId:{type:String,required:true},
    imageUrl:{type:String,required:true},
    courseId:{type:String,required:true},
    uId:{type:String,required:true}
})
module.exports=mongoose.model("student",studentSchema);