import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectCloudinary from "./config/cloudinary.js";
import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import corsMiddleware from "./middleware/corsMiddleware.js";

dotenv.config();

const app = express();

// ======= MIDDLEWARES =======
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(corsMiddleware); 



// ======= CLOUDINARY =======
connectCloudinary();

// ======= DATABASE CONNECTION =======
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// ======= ROUTES =======

// Home
app.get("/", (req, res) => {
  res.json({ message: "Desi Basket Server is running 🚀!" });
});

// Auth routes (/api/register , /api/login)
app.use("/api", authRoutes);

// Profile routes
app.use("/api/profile", profileRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// ======= SERVER START =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ======= ERROR HANDLING =======
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
