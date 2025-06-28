import express, { Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import { AuthRequest, requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(express.json());

// connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/protected", requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ message: `Hello user ${req.userId}` });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
