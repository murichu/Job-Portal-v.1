import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/userController.js";
import upload, { handleUploadError } from "../config/multer.js";
import { requireAuth } from "@clerk/express";

const userRouter = express.Router();

// @route   GET /user
// @desc    Get authenticated user's profile data
// @access  Private (should be protected by middleware)
userRouter.get("/user", requireAuth(), getUserData);

// @route   POST /apply
// @desc    Apply for a job (should be POST not GET since it's a write operation)
// @access  Private
userRouter.post("/apply", requireAuth(), applyForJob);

// @route   GET /applications
// @desc    Get all jobs the user has applied to
// @access  Private
userRouter.get("/applications", requireAuth(), getUserJobApplications);

// @route   POST /update-resume
// @desc    Update user's resume (uploaded via multipart/form-data)
// @access  Private
userRouter.post(
  "/update-resume",
  requireAuth(),
  upload.single("resume"), // Multer middleware for file upload
  handleUploadError, // Custom middleware to handle upload errors
  updateUserResume // Controller to save resume info
);

export default userRouter;
