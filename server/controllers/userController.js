import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";
import rateLimit from "express-rate-limit";
import { AppError, catchAsync } from "../middleware/errorHandler.js";
import { validationRules } from "../middleware/validation.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// Rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register a user
// Handles creating a new user account with provided details such as name, email, password, etc.
export const registerUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  // Check for missing fields
  if (!name || !email || !password || !imageFile) {
    throw new AppError("Missing details", 400);
  }

  // Sanitize inputs
  const sanitizedName = validationRules.name(name);
  const sanitizedEmail = validationRules.email(email);
  validationRules.password(password);

  // Check if user already exists
  const userAlreadyExists = await User.findOne({ email: sanitizedEmail });
  if (userAlreadyExists) {
    throw new AppError("User already registered", 409);
  }

  // Hash password with higher salt rounds for better security
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  // Upload image to Cloudinary with error handling
  let imageUpload;
  try {
    imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "user_profiles",
      transformation: [
        { width: 200, height: 200, crop: "fill", quality: "auto" },
      ],
    });
  } catch (cloudErr) {
    console.error("Cloudinary upload error:", cloudErr);
    throw new AppError("Image upload failed. Please try again.", 500);
  }

  // Create new user
  const user = await User.create({
    name: sanitizedName,
    email: sanitizedEmail,
    password: hashPassword,
    image: imageUpload.secure_url,
  });

  // Return success with token
  return sendSuccess(res, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    token: generateToken(user._id),
  }, "Account created successfully", 201);
});

// User Login
// Authenticates a user using credentials (e.g., email and password) and returns a token/session
export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body; // Extract login credentials from the request body

  // Input validation
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const sanitizedEmail = validationRules.email(email);

  // Check if a user with the provided email exists
  const user = await User.findOne({ email: sanitizedEmail }).select(
    "+password"
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Update last login time
  user.lastLogin = new Date();
  await user.save();

  // If authentication is successful, return user details and a JWT token
  return sendSuccess(res, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    token: generateToken(user._id),
  }, "Login successful");
});

// Get user data
// Retrieves detailed information about the currently logged-in user (profile, settings, etc.)
// Controller to get authenticated user data
export const getUserData = catchAsync(async (req, res) => {
  // Access the authenticated user object attached to the request (set by auth middleware)
  const user = req.user;
  return sendSuccess(res, { user }, "User data retrieved successfully");
});

// Apply for Job
export const applyForJob = catchAsync(async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  if (!jobId) {
    throw new AppError("Job ID is required", 400);
  }

  // Validate jobId format
  validationRules.mongoId(jobId);

  // Check if job exists
  const jobData = await Job.findById(jobId);
  if (!jobData) {
    throw new AppError("Job not found", 404);
  }

  // Check if job is visible
  if (!jobData.visible) {
    throw new AppError("This job is no longer available", 400);
  }

  // Check if already applied (with better error handling)
  const existingApplication = await JobApplication.findOne({ jobId, userId });
  if (existingApplication) {
    throw new AppError("You have already applied for this job", 400);
  }

  // Create application
  await JobApplication.create({
    companyId: jobData.companyId,
    userId,
    jobId,
    date: Date.now(),
  });

  return sendSuccess(res, null, "Job applied successfully", 201);
});

// Get user applied applications
export const getUserJobApplications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 items per page
  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    JobApplication.countDocuments({ userId }),
  ]);

  return sendSuccess(res, {
    applications,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      count: applications.length,
      totalApplications: total,
    },
  }, "Applications retrieved successfully");
});

// Update user profile (Resume)
export const updateUserResume = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const resumeFile = req.file;

  const userData = await User.findById(userId);
  if (!userData) {
    throw new AppError("User not found", 404);
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
      throw new AppError("Only PDF documents are allowed", 400);
    }

    // Upload to Cloudinary (PDF requires resource_type: "raw")
    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
      resource_type: "raw", // Needed for non-image files like PDFs
      folder: "resumes",
    });

    userData.resume = resumeUpload.secure_url;
    await userData.save();
  }

  return sendSuccess(res, { user: userData }, "Resume updated successfully");
});
