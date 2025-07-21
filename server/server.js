import "./config/instrument.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import connectDB from "./config/mongoDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
//import { clerkMiddleware } from '@clerk/express'
//import { serve } from "inngest/express";
//import { inngest, functions } from "./inngest/index.js"

// Initialize dotenv to load environment variables
dotenv.config();

// Initialize express
const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());
//app.use(clerkMiddleware())

// Routes
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Set up the "/api/inngest" (recommended) routes with the serve handler
//app.use("/api/inngest", serve({ client: inngest, functions }));

app.post("/webhooks", clerkWebhooks);

// API Endpoints
app.use("/api/user", userRouter);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
