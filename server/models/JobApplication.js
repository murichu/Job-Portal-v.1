import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
      index: true,
    },
    date: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

// Compound indexes
JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true }); // No duplicate apps per job/user
JobApplicationSchema.index({ companyId: 1, date: -1 }); // Fast recent apps lookup by company

// Safe model creation for serverless / hot reload environments
const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;
