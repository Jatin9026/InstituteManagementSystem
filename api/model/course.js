const mongoose=require("mongoose");
const courseSchema=new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    courseName:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    startDate:{type:String,required:true},
    endDate:{type:String,requied:true},
    imageId:{type:String,requird:true},
    imageUrl:{type:String,required:true},
    uId:{type:String,requied:true}
})
module.exports=mongoose.model("course",courseSchema);