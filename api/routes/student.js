const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../model/student");
const cloudinary = require("cloudinary").v2;
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
const { resource } = require("../app");
const student = require("../model/student");
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

//update student
// Update student
router.put("/:id", checkAuth, async (req, res) => {
    try {
      const studentId = req.params.id; // FIXED: req.params not res.params
  
      // Get token
      const token = req.headers.authorization?.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      // Fetch student by ID
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ msg: "Student not found" }); // FIXED: correct error message
      }
  
      // Authorization check
      if (student.uId.toString() !== verifiedToken.uId) {
        return res.status(403).json({ msg: "Unauthorized to update this student" });
      }
  
      // Handle image upload if exists
      let imageUrl = student.imageUrl;
      let imageId = student.imageId;
  
      if (req.files && req.files.image) {
        // Delete old image from cloudinary
        await cloudinary.uploader.destroy(student.imageId);
  
        // Upload new image
        const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
  
        imageUrl = uploadedImage.secure_url;
        imageId = uploadedImage.public_id;
      }
  
      // Updated student data
      const updatedStudentData = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        courseId: req.body.courseId,
        imageId: imageId,
        imageUrl: imageUrl,
        uId: verifiedToken.uId
      };
  
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        updatedStudentData,
        { new: true }
      );
  
      return res.status(200).json({
        msg: "Student updated successfully",
        data: updatedStudent,
      });
  
    } catch (err) {
      console.error("Student update error:", err);
      return res.status(500).json({
        msg: "Internal server error",
        error: err.message,
      });
    }
  });
  //get latest 5 student data 
  router.get("/latest-student",checkAuth,(req,res)=>{
    const token=req.headers.authorization.split(" ")[1];
    const verifiedToken=jwt.verify(token,process.env.JWT_SECRET);
    Student.find({uId:verifiedToken.uId}).sort({$natural:-1}).limit(5)//peeche se data nikal rha hoga 5 student ka
    .then(result=>{
        res.status(200).json({
            students:result
        })
    }).catch(err=>{
    res.status(500).json({
        msg:"error",
        error:err
    })
  })
  })

  module.exports=router