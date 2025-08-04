// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();
const corsOptions = {
  origin: "https://duong123321.netlify.app", // hoặc dùng mảng nếu cần nhiều domain
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));


// Phân tích JSON body
app.use(express.json());

// Các route
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Mount bookingRoutes dưới path /api/bookings
app.use("/api/bookings", bookingRoutes);

module.exports = app;
