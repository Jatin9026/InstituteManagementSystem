const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = require("../model/course");
const cloudinary = require("cloudinary").v2;
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//add course
router.post("/add-course", checkAuth, async (req, res) => {
  try {
    // 1. Extract token and verify
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Check if file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image file is required." });
    }

    // 3. Upload to Cloudinary
    const cloudRes = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      { folder: "courses" }
    );
    // 4. Create new course
    const newCourse = new Course({
      _id: new mongoose.Types.ObjectId(),
      courseName: req.body.courseName,
      price: req.body.price,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      uId: verifiedToken.uId,
      imageUrl: cloudRes.secure_url, // typo fixed: seure_url → secure_url
      imageId: cloudRes.public_id,
    });

    const result = await newCourse.save();

    res.status(200).json({ newCourse: result });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//get request for get all courses for any users
router.get("/all-courses", checkAuth, async (req, res) => {
  try {
    // 1. Extract token and verify
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Course.find({ uId: verifiedToken.uId });
    res.status(200).json({
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: "internal server error",
    });
  }
});
//get one course for any user
router.get("/course-detail/:id", checkAuth, async (req, res) => {
    try {
      const user = await Course.findById(req.params.id);
      console.log(req.params.id);
      console.log(req.params)
      console.log(req)
      res.status(200).json({
        user: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        err: "internal server error",
      });
    }
  });
  //delete course
  
router.delete('/:id', checkAuth, async (req, res) => {
    try {
      // Extract token from the header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token missing or invalid" });
      }
  
      const token = authHeader.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find course by ID
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // Check if the user is the owner
      if (course.uId.toString() !== verifiedToken.id) {
        return res.status(403).json({ error: "Unauthsorized user" });
      }
  
      // Delete course and associated image
      await Course.findByIdAndDelete(req.params.id);
      await cloudinary.uploader.destroy(course.imageId);
  
      return res.status(200).json({ msg: "Course deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
  
  // DELETE /api/courses/:id
router.delete('/:id', checkAuth, async (req, res) => {
    try {
      // 1. Validate and extract JWT token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token missing or invalid" });
      }
  
      const token = authHeader.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET); // should contain .id
  
      // 2. Validate Course ID format
      const courseId = req.params.id?.trim();
      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: "Invalid course ID format" });
      }
  
      // 3. Retrieve course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // 4. Ownership check
      if (course.uId.toString() !== verifiedToken.id) {
        return res.status(403).json({ error: "Unauthorized user" });
      }
  
      // 5. Delete course and associated image
      await Course.findByIdAndDelete(courseId);
      if (course.imageId) {
        await cloudinary.uploader.destroy(course.imageId);
      }
  
      return res.status(200).json({ msg: "Course deleted successfully" });
    } catch (err) {
      console.error("Error deleting course:", err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
  

module.exports = router;
