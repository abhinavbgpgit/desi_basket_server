const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  saveProfileStep,
  getProfile
} = require("../controllers/profile.controller");

/* Save step-wise profile */
router.post("/save-step", auth, saveProfileStep);

/* Get profile */
router.get("/", auth, getProfile);

module.exports = router;
