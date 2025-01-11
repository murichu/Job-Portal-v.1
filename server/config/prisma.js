import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectToDb = async () => {
  try {
    await prisma.$connect();  // Explicitly connect to the database
    console.log("Connected to MongoDB Cloud");
  } catch (error) {
    console.error("MongoDB connection Error:", error);
  }
};

// Call the connection function
connectToDb();

export default prisma;
