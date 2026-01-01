import express from "express";
const router = express.Router();

// Correctly import named middleware
import { auth } from "../middleware/auth.middleware.js";

// Import controller functions
import { saveProfileStep, getProfile } from "../controllers/profile.controller.js";

// Save step-wise profile
router.post("/save-step", auth, saveProfileStep);

// Get profile
router.get("/", auth, getProfile);

export default router;
