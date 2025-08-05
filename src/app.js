const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// ==========================
// ✅ CORS CONFIGURATION
// ==========================
const allowedOrigins = [
  "https://fe-booking-car.vercel.app",
  "https://be-bookingcar.onrender.com",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 Request Origin:", origin);
    if (!origin) return callback(null, true); // Cho phép Postman, curl, server-side
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Xử lý preflight request cho mọi route
app.options("*", cors(corsOptions));

// ==========================
// ✅ BODY PARSER
// ==========================
app.use(express.json());

// ==========================
// ✅ TEST ROOT ROUTE
// ==========================
app.get("/", (req, res) => {
  res.json({ message: "API server is running!" });
});

// ==========================
// ✅ ROUTES
// ==========================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ==========================
// ✅ STATIC BUILD (FE)
// ==========================
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../../FE_BookingCar/dist");
  app.use(express.static(buildPath));

  // SPA fallback
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) return next();
    const indexPath = path.join(buildPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Please build FE_BookingCar/dist.");
    }
  });
}

// ==========================
// ✅ 404 HANDLER FOR API
// ==========================
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({
      error: "Not Found",
      message: `Route ${req.originalUrl} not found`
    });
  }
  next();
});

// ==========================
// ✅ GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong!"
  });
});

module.exports = app;
