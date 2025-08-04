const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// ✅ Danh sách các origin được phép
const allowedOrigins = [
  "http://localhost:5173",
  "https://duong123321.netlify.app"
];

// ✅ Cấu hình CORS dùng lại cho mọi nơi
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ✅ Dùng cho toàn bộ app
app.use(cors(corsOptions));

// ✅ Xử lý preflight (OPTIONS) với đúng corsOptions
app.options("*", cors(corsOptions));

// ✅ Parse body
app.use(express.json());

// ✅ Các routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
