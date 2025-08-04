const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// ✅ Cho phép tất cả các miền truy cập (CORS mở toàn bộ)
app.use(cors({
  origin: true,          // Cho phép mọi domain
  credentials: true      // Cho phép gửi cookie, auth headers,...
}));

// ✅ Xử lý preflight requests (OPTIONS)
app.options("*", cors());

// ✅ Middleware để parse JSON body
app.use(express.json());

// ✅ Các route
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
