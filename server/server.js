import "./config/instrument.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import connectDB from "./config/mongoDB.js";
import cookieParser from "cookie-parser";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRouter from "./routes/companyRoutes.js";
import connectCloudinary from "./config/Cloudinary.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRouter.js";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to database
await connectDB();

await connectCloudinary();

// General middleware
app.use(
  cors({
    //origin: process.env.CLIENT_URL, // adjust to your frontend URL
    origin: "https://jfj697-5173.csb.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get("/", (req, res) => {
  res.send("API is working!");
});

// User API routes
app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRouter);

// Debug route for Sentry
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// 404 route handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Sentry error handler (must come after all routes and middleware)
Sentry.setupExpressErrorHandler(app);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
