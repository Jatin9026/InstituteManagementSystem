const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 🔐 POST /signup — Register User
router.post("/signup", async (req, res) => {
  try {
    const { fullName,phone , email, password } = req.body;

    // Email existence check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already registered" });
    }
    
    // Image validation
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload to cloudinary
    const cloudRes = await cloudinary.uploader.upload(req.files.image.tempFilePath);

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
      imageUrl: cloudRes.secure_url,
      imageId: cloudRes.public_id,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        email: savedUser.email,
        fullName:savedUser.fullName,
        phone:savedUser.phone,
        imageUrl: savedUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//login 
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;//sab kuch niakl lo 
  
      if (!password) {
        return res.status(400).json({ error: "Password must be provided" });
      }
  
      const user = await User.findOne({ email }); //mongodb se user ko dhundo email ke basis pe
      if (!user) {
        return res.status(404).json({ error: "Email not registered" });
      }
  
      if (!user.password) {
        return res.status(500).json({ error: "Corrupted user password in DB" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }
  
      const token = jwt.sign(
        {
          uId: user._id,
          email: user.email,
          fullName:user.fullName,
          phone:user.phone
        },
        process.env.JWT_SECRET,
        { expiresIn: "365d" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          email: user.email,
         fullName:user.fullName,
         phone:user.phone,
          imageUrl: user.imageUrl,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
module.exports = router;
