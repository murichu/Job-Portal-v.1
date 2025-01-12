import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as Sentry from "@sentry/node";
import connectDB from "./config/mongoDB.js";
import cookieParser from 'cookie-parser';
import { clerkWebhooks } from './controllers/webhooks.js';
import userRouter from './routes/userRouter.js'


// Initialize dotenv to load environment variables
dotenv.config();

// Initialize express
const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());


// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

// API Endpoints
app.use('/api/user', userRouter)

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhook', clerkWebhooks);


// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
