// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// Cho phép frontend ở localhost:5173 truy cập
app.use(cors({ origin: "http://localhost:5173" }));

// Phân tích JSON body
app.use(express.json());

// Các route
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Mount bookingRoutes dưới path /api/bookings
app.use("/api/bookings", bookingRoutes);

module.exports = app;
