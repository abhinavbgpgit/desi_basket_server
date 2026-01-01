// controllers/auth.controller.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Strong password regex
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { mobile, password, role } = req.body;

    if (!mobile || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const existing = await User.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      mobile,
      password: hashedPassword,
      role,
    });

    // ===== COOKIE after register =====
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.status(201).json({
      message: "Registered successfully",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT token expires in 3 hours
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    const isProd = process.env.NODE_ENV === "production";

    // ===== COOKIE =====
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.json({
      message: "Login successful",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
