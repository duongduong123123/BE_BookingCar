const express = require("express");
const bookingController = require("../controllers/booking.controller");
const { verifyAdmin } = require("../middlewares/auth");

const router = express.Router();

// Export bookings to Excel (admin only)
router.get("/export", bookingController.exportBookingsToExcel);

// POST /api/bookings/create-booking
router.post("/create-booking", bookingController.createBooking);

// GET  /api/bookings/get-all-bookings  (admin only)
router.get("/get-all-bookings", verifyAdmin, bookingController.getAllBookings);

module.exports = router;
