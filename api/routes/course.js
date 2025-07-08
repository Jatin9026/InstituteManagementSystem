const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = require("../model/course");
const cloudinary = require("cloudinary").v2;
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
const { resource } = require("../app");

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
    console.log(req.params);
    console.log(req);
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
// ✅ Delete Course (With Ownership Check)
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

    const courseId = req.params.id;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // 🔐 Ownership check
    if (course.uId.toString() !== verifiedToken.uId) {
      return res.status(403).json({ error: "Unauthorized user" });
    }

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

//PUT Request to update course we do not use patch req because agar frontend se data aayega to pura aayega or agar patch use karrenge to sare fields ko update karne padenge agar 1 bhi field miss hota hai to uski value null slet ho jayegin is liye put use karenge
router.put("/:id", checkAuth, async (req, res) => {
    try {
      const courseId = res.params.id;
      const token = req.headers.authorization?.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET); // Or use `req.user` from middleware
  
      // Fetch course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ msg: "Course not found" });
      }
  
      // Authorization check
      if (course.uId.toString() !== verifiedToken.uId) {
        return res.status(403).json({ msg: "Unauthorized to update this course" });
      }
  
      // Prepare new data
      let imageUrl = course.imageUrl;
      let imageId = course.imageId;
  
      if (req.files && req.files.image) {
        // Delete old image
        await cloudinary.uploader.destroy(course.imageId);
  
        // Upload new image
        const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
        imageUrl = uploadedImage.secure_url;
        imageId = uploadedImage.public_id;
      }
  
      const updatedCourseData = {
        courseName: req.body.courseName,
        price: req.body.price,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        uId: verifiedToken.uId,
        imageUrl,
        imageId,
      };
  
      const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true });
  
      return res.status(200).json({
        msg: "Course updated successfully",
        data: updatedCourse,
      });
  
    } catch (err) {
      console.error("Course update error:", err);
      return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
  });
  
module.exports = router;
