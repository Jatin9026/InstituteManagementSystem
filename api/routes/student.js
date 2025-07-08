const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../model/student");
const cloudinary = require("cloudinary").v2;
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
const { resource } = require("../app");
//signup---->post--->data client se bhejna
router.post("/add-student", checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Image upload failed", error: err });
      }
      const newStudent = new Student({
        _id: new mongoose.Types.ObjectId(),
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        courseId: req.body.courseId,
        imageId: result.public_id,
        imageUrl: result.secure_url,
        uId: verifiedToken.uId
      });
  
      newStudent
        .save()
        .then((savedStudent) => {
          res.status(200).json({
            msg: "Student added successfully",
            newStudent: savedStudent
          });
        })
        .catch((err) => {
          res.status(400).json({
            msg: "Internal server error",
            error: err
          });
        });
    });
  });
  
//get all own students
router.get("/all-student",checkAuth,(req,res)=>{
    const token=req.headers.authorization.split(" ")[1];
    const verifiedToken=jwt.verify(token,process.env.JWT_SECRET);
    Student.find({uId:verifiedToken.uId}).select('_id fullName phone address email courseId imageUrl imageId uId').then(result=>{
        res.status(200).json({
            student:result
        })
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})
//get all own students for a course
router.get("/all-student/:courseId",checkAuth,(req,res)=>{
    const token=req.headers.authorization.split(" ")[1];
    const verifiedToken=jwt.verify(token,process.env.JWT_SECRET);
    Student.find({uId:verifiedToken.uId,courseId:req.params.courseId}).select('_id fullName phone address email courseId imageUrl imageId uId').then(result=>{
        res.status(200).json({
            student:result
        })
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

// ✅ Delete Student (With Ownership Check)
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    const studentId = req.params.id;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid Student ID format" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 🔐 Ownership check
    if (student.uId.toString() !== verifiedToken.uId) {
      return res.status(403).json({ error: "Unauthorized user" });
    }

    await Student.findByIdAndDelete(studentId);

    if (student.imageId) {
      await cloudinary.uploader.destroy(student.imageId);
    }

    return res.status(200).json({ msg: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

  module.exports=router