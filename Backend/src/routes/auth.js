// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// Use a safe development default for JWT secret if not provided.
// In production, ensure JWT_SECRET is set via environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Dev fallback user (only used when DB is not connected and not in production)
const DEV_FALLBACK_USER = {
  _id: 'dev',
  name: 'Developer',
  email: 'dev@local',
  role: 'admin',
  password: undefined,
};

const signToken = (id) => {
  // Ensure expiresIn is a valid value for jsonwebtoken: either a number (seconds) or a timespan string
  const rawExpiresIn = process.env.JWT_EXPIRES_IN || '90d';
  // If the env var is a numeric string, convert to number (seconds); otherwise leave as string like '90d'
  const expiresIn = /^\d+$/.test(String(rawExpiresIn)) ? Number(rawExpiresIn) : String(rawExpiresIn);

  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Ensure cookie expiry uses a sane default (days). If env var missing/invalid, default to 90 days.
  const cookieDays = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Register
router.post("/register", async (req, res, next) => {
  // If DB isn't connected, return 503 service unavailable to avoid long timeouts
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: "error",
      message: "Database unavailable. Please try again later.",
    });
  }
  try {
    const {
      name,
      email,
      password,
      passwordConfirm,
      role,
      age,
      gender,
      interests,
      location,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Name, email, and password are required",
      });
    }

    // Only check passwordConfirm if it's provided
    if (passwordConfirm && password !== passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "user",
      age,
      gender,
      interests,
      location,
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error during registration",
    });
  }
});

// Login
router.post("/login", async (req, res, next) => {
  // If DB isn't connected, return 503 service unavailable to avoid long timeouts
  if (mongoose.connection.readyState !== 1) {
    // Decide whether to allow the dev fallback login. Prefer NODE_ENV !== 'production',
    // but allow an explicit environment flag ALLOW_DEV_LOGIN=true for local testing even
    // when NODE_ENV is set to 'production' in the .env file.
    const allowDevFallback = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_LOGIN === 'true';

    const { email, password } = req.body || {};
    if (allowDevFallback) {
      // Dev fallback: allow a single test user when enabled
      if (email === 'dev@local' && password === 'devpass') {
        // return token for dev user
        return createSendToken(DEV_FALLBACK_USER, 200, res);
      }
      return res.status(503).json({
        status: "error",
        message: "Database unavailable. For local testing you can use dev@local / devpass",
      });
    }

    return res.status(503).json({
      status: "error",
      message: "Database unavailable. Please try again later.",
    });
  }
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Protect middleware
const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};

// RestrictTo middleware
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

// Get current user
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
module.exports.protect = protect;
module.exports.restrictTo = restrictTo;
