import "./config/instrument.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import connectDB from "./config/mongoDB.js";
import cookieParser from "cookie-parser";
//import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRouter from "./routes/companyRoutes.js";
import connectCloudinary from "./config/Cloudinary.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRouter.js";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// ✅ Trust proxy to fix X-Forwarded-For error with express-rate-limit
app.set("trust proxy", false);

// ✅ Apply rate limiter before routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Connect to database and Cloudinary
await connectDB();
await connectCloudinary();

// General middleware
app.use(
  cors({
    origin: "https://jfj697-5173.csb.app", // Adjust to your frontend URL
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
  res.send("API is working!");
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Sentry error handler (last)
Sentry.setupExpressErrorHandler(app);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
