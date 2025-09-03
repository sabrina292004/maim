const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
// Allow multiple frontend origins (use comma-separated FRONTEND_ORIGIN env var)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5174,http://localhost:5173";
const allowedOrigins = FRONTEND_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server, curl)
      if (!origin) return callback(null, true);

      // Always allow localhost with any port in development for convenience
      if (process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Match explicit origins from FRONTEND_ORIGIN env var
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Not allowed
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
  // Disable mongoose buffering so queries fail fast when DB is unreachable in dev.
  mongoose.set('bufferCommands', false);
  mongoose.set('bufferTimeoutMS', 2000);
    // For development, we'll use a local MongoDB connection
    // In production, this would be MongoDB Atlas
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/eventx-studio";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
    app.locals.dbConnected = true;
    console.log(`Backend allowed origins: ${allowedOrigins.join(', ')}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // In development, don't crash the server when the DB is unreachable. Allow
    // frontend development to proceed; request handlers should check
    // app.locals.dbConnected if they depend on the DB.
    app.locals.dbConnected = false;
    console.warn('Continuing without MongoDB connection (development only).');
  }
};

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const eventRoutes = require("./routes/events");
const ticketRoutes = require("./routes/tickets");
const analyticsRoutes = require("./routes/analytics");
const paymentRoutes = require("./routes/payments");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const supportRoutes = require("./routes/support");
const marketingRoutes = require("./routes/marketing");
const categoriesRoutes = require("./routes/categories");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/categories", categoriesRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "EventX Studio API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server with port-retry on EADDRINUSE
const startServer = async (port = Number(PORT), maxRetries = 5) => {
  await connectDB();

  let attempts = 0;
  const tryListen = (p) => {
    const server = app.listen(p, '0.0.0.0', () => {
      console.log(`Server is running on port ${p}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        attempts += 1;
        if (attempts <= maxRetries) {
          const nextPort = p + 1;
          console.warn(`Port ${p} in use, trying ${nextPort} (attempt ${attempts}/${maxRetries})`);
          // try next port after a short delay
          setTimeout(() => tryListen(nextPort), 200);
        } else {
          console.error(`All retries failed. Port ${p} still in use after ${maxRetries} attempts.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  };

  tryListen(port);
};

startServer();
