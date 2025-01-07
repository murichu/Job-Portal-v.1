import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  console.log("Connected to MongoDB Cloud")
} catch {
  console.error("MongoDB connection Error")
}

export default prisma;