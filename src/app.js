// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// Cho phép cấu hình origin động qua biến môi trường khi deploy
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
    "https://duong123321.netlify.app",
    "https://fe-booking-car.vercel.app"
  ];
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép request không có origin (như từ Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));


// Phân tích JSON body
app.use(express.json());


// Các route API
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Phục vụ file tĩnh (frontend build) nếu deploy chung FE + BE
const path = require("path");
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../../FE_BookingCar/dist");
  app.use(express.static(buildPath));
  // fallback cho SPA, chỉ khi không phải API và file index.html tồn tại
  const fs = require("fs");
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


// Xử lý route không tồn tại (404) cho API
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({
      error: "Not Found",
      message: `Route ${req.originalUrl} not found`
    });
  }
  next();
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong!"
  });
});

module.exports = app;
