import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    if (process.env.MONGODB_CONNECTION_STRING) {
      await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    } else {
      throw new Error("Connection string is required.");
    }
  } catch (error) {
    throw new Error("Database connection failed." + error);
  }
}
