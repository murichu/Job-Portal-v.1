import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes by verifying the token and attaching the user to the request
export const protectUser = async (req, res, next) => {
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

    // Find user by decoded token ID and exclude the password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach user info to the request for use in next handlers
    req.user = user;

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("protectUser error:", error);

    // Invalid or expired token
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};
