import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  loginUser,
  registerUser,
  updateUserResume,
} from "../controllers/userController.js";
import upload, { handleUploadError } from "../config/multer.js";
import { protectUser } from "../middleware/userAuth.js";

const userRouter = express.Router();

// Register a user
userRouter.post(
  "/register",
  upload.single("image"),
  handleUploadError,
  registerUser
);

// Company login
userRouter.post("/login", loginUser);

// @route   GET /user
// @desc    Get authenticated user's profile data
// @access  Private
userRouter.get("/user", protectUser, getUserData);

// @route   POST /apply
// @desc    Apply for a job
// @access  Private
userRouter.post("/apply", protectUser, applyForJob);

// @route   GET /applications
// @desc    Get all jobs the user has applied to
// @access  Private
userRouter.get("/applications", protectUser, getUserJobApplications);

// @route   POST /update-resume
// @desc    Update user's resume (uploaded via multipart/form-data)
// @access  Private
userRouter.post(
  "/update-resume",
  protectUser,
  upload.single("resume"), // Multer middleware for file upload
  handleUploadError, // Custom middleware to handle upload errors
  updateUserResume // Controller to save resume info
);

export default userRouter;
