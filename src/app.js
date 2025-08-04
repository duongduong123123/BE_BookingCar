// // app.js
// const express = require("express");
// const cors = require("cors");
// const userRoutes = require("./routes/user.routes");
// const authRoutes = require("./routes/auth.routes");
// const bookingRoutes = require("./routes/booking.routes");

// const app = express();

// // Cho phép frontend ở localhost:5173 truy cập
// // app.use(cors({ origin: "http://localhost:5173" }));
// const allowedOrigins = [
//     'http://localhost:5173',
//     'https://duong123321.netlify.app'
// ];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));

// // Xử lý preflight request (OPTIONS)
// app.options('*', cors());

// // Phân tích JSON body
// app.use(express.json());

// // Các route
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);

// // Mount bookingRoutes dưới path /api/bookings
// app.use("/api/bookings", bookingRoutes);

// module.exports = app;
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://duong123321.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS globally
app.use(cors(corsOptions));

// Apply to all OPTIONS requests
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
