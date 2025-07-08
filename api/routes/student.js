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
  

  module.exports=router