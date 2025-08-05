// app.js
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// Danh sách origin được phép
const allowedOrigins = [
  "http://localhost:5173",
  "https://duong123321.netlify.app",
  "https://fe-booking-car.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Cho phép request không có origin (Postman, curl, server-side)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Áp dụng CORS
app.use(cors(corsOptions));

// Phân tích JSON body
app.use(express.json());

// Đăng ký các route
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
