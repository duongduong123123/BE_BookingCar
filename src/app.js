const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// ✅ Cấu hình CORS cụ thể cho frontend ở localhost và Netlify
const allowedOrigins = [
    "http://localhost:5173",
    "https://duong123321.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép các origin đã khai báo hoặc không có origin (Postman, mobile app,...)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Xử lý preflight requests (OPTIONS)
app.options("*", cors());

// ✅ Middleware parse JSON body
app.use(express.json());

// ✅ Các route
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
