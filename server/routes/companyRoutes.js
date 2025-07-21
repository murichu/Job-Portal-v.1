import express from "express";
import {
  ChangeJobApplicationStatus,
  ChangeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyController.js";
import upload, { handleUploadError } from "../config/multer.js";
import { protectCompany } from "../middleware/AuthMiddleware.js";

const companyRouter = express.Router();

// Register a Company
companyRouter.post(
  "/register",
  upload.single("image"),
  handleUploadError,
  registerCompany
);

// Company login
companyRouter.post("/login", loginCompany);

// Get company details
companyRouter.get("/company", protectCompany, getCompanyData);

// Post a new job
companyRouter.post("/post-job", protectCompany, postJob);

// Get applicants for a company's jobs
companyRouter.get("/applicants", protectCompany, getCompanyJobApplicants);

// List all jobs posted by the company
companyRouter.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Change application status (e.g., approve/reject)
companyRouter.post(
  "/change-status",
  protectCompany,
  ChangeJobApplicationStatus
);

// Change job visibility (e.g., show/hide job posting)
companyRouter.post("/change-visibility", protectCompany, ChangeJobVisibility);

export default companyRouter;
