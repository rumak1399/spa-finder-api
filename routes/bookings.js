const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const bookingController = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

// Get all bookings - admin only
router.get("/", [protect, authorize("admin")], bookingController.getBookings);

// Get user bookings
router.get("/me", protect, bookingController.getUserBookings);

// Get provider bookings
router.get(
  "/provider",
  [protect, authorize("provider", "admin")],
  bookingController.getProviderBookings
);

// Create booking
router.post(
  "/",
  [
    protect,
    [
      check("service", "Service is required").not().isEmpty(),
      check("date", "Date is required").not().isEmpty().isDate(),
      check("time", "Time is required").not().isEmpty(),
    ],
  ],
  bookingController.createBooking
);

// Update booking status
router.put("/:id", protect, bookingController.updateBookingStatus);

// Delete booking
router.delete("/:id", protect, bookingController.deleteBooking);

module.exports = router;
