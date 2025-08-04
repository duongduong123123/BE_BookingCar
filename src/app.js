const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// Cấu hình CORS cho frontend Netlify và localhost
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://duong123321.netlify.app'
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // OPTIONS cho preflight request

// Body parser
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
