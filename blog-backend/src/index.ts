import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
app.use(express.json());

// connect to MongoDB
connectDB();

const PORT = process.env.PORT || 4000;

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
