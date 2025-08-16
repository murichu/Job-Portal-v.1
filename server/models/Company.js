import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Company name
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, required: true }, // Logo
    password: { type: String, required: true },
    recruiterName: { type: String, required: true },
    recruiterPosition: { type: String, required: true },
    companyPhone: { type: String, required: true },
    companyLocation: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
