import "./config/instrument.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import connectDB from "./config/mongoDB.js";
import cookieParser from "cookie-parser";
import companyRouter from "./routes/companyRoutes.js";
import connectCloudinary from "./config/Cloudinary.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRouter.js";
import rateLimit from "express-rate-limit";
import { 
  globalErrorHandler, 
  handleUnhandledRejection, 
  handleUncaughtException 
} from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
handleUncaughtException();

// Initialize express
const app = express();

// ✅ Trust proxy to fix X-Forwarded-For error with express-rate-limit
app.set("trust proxy", 1);

// ✅ Apply rate limiter before routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});

app.use(limiter);

// Connect to database and Cloudinary
await connectDB();
await connectCloudinary();

// General middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRouter);

// Sentry test route
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// Health check
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Job Portal API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.originalUrl 
  });
});

// Global error handler
app.use(globalErrorHandler);

// Sentry error handler (last)
Sentry.setupExpressErrorHandler(app);

// Handle unhandled promise rejections
handleUnhandledRejection();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
