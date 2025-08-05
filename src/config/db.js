const mongoose = require("mongoose");

const connectDB = async () => {
    // In debug xem biến env có đúng không
    console.log("→ MONGO_URI:", process.env.MONGO_URI);

    try {
        // Kết nối tới Atlas qua biến môi trường, bỏ options đã deprecated
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
