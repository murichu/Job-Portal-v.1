import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getUserData Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Apply for Job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    // Check if already applied
    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });
    if (isAlreadyApplied) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied for this job" });
    }

    // Check if job exists
    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Create application
    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res
      .status(201)
      .json({ success: true, message: "Job applied successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error from unique index
      return res
        .status(400)
        .json({ success: false, message: "Already applied for this job" });
    }
    console.error("applyForJob Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("getUserJobApplications Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user profile (Resume)
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    const resumeFile = req.file; // Changed from req.resumeFile to req.file

    const userData = await User.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (resumeFile?.path) {
      // Allow only PDF files
      const allowedTypes = ["application/pdf"];
      const allowedExtensions = [".pdf"];
      const fileExtension = resumeFile.originalname.toLowerCase().slice(-4);

      if (
        !allowedTypes.includes(resumeFile.mimetype) ||
        !allowedExtensions.includes(fileExtension)
      ) {
        return res.status(400).json({
          success: false,
          message: "Only PDF documents are allowed",
        });
      }

      // Upload to Cloudinary (PDF requires resource_type: "raw")
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
        resource_type: "raw", // Needed for non-image files like PDFs
        folder: "resumes",
      });

      userData.resume = resumeUpload.secure_url;
      await userData.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Resume updated successfully", user: userData });
  } catch (error) {
    console.error("updateUserResume Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};