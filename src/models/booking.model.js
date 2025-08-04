const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
            index: true,
        },
        pickupLocation: {
            type: String,
            required: true,
            trim: true,
        },
        destinationLocation: {
            type: String,
            required: true,
            trim: true,
        },
        scheduledTime: {
            type: Date,
            required: true,
        },
        // hành lý: 1 trong 3 option
        luggage: {
            type: String,
            enum: ["vali", "hồ sơ", "khác"],
            required: true,
            default: "khác",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", BookingSchema);
