import mongoose from "mongoose";
import { DB_NAME } from "./../constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: DB_NAME,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
