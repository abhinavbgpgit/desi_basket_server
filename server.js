import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectCloudinary from "./config/cloudinary.js";
import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// ======= MIDDLEWARES =======
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ======= CORS CONFIG =======
const allowedOrigins = [
  "http://localhost:5173",                  // local frontend
  "https://desi-kisan-live.vercel.app"     // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman, mobile apps etc.
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error(`CORS blocked: ${origin}`), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // cookies/session allow
}));

// OPTIONS preflight handle
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

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
  res.json({ message: "Desi Basket Server is running!" });
});

// Auth routes (register/login)
app.use("/", authRoutes);  // auth.routes.js में /api/register और /api/login होना चाहिए

// Profile routes
app.use("/api/profile", profileRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
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
