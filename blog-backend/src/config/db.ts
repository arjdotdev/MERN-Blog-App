import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI!;
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
    process.exit(1);
    //explanation: when node hits this line, it immediately stops the process,
    //process.exit(0) is no error whereas process.exit(1) is there was error.
  }
};
