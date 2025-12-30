import express from "express";
const router = express.Router();

import auth from "../middleware/auth.middleware.js";
import {
  saveProfileStep,
  getProfile,
} from "../controllers/profile.controller.js";

// Save step-wise profile
router.post("/save-step", auth, saveProfileStep);

// Get profile
router.get("/", auth, getProfile);

export default router;
