import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';


// Initialize dotenv to load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

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
