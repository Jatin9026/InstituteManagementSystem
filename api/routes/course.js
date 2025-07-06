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
//get request for get all courses
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
module.exports = router;
