import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

// Middleware to protect routes by verifying the token and attaching the company to the request
export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;

  // If no token is provided, deny access
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login again" });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find company by decoded token ID and exclude the password field
    const company = await Company.findById(decoded.id).select("-password");

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Attach company info to the request for use in next handlers
    req.company = company;

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("protectCompany error:", error);

    // Invalid or expired token
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};
