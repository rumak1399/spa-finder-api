import { Router } from "express";
const router = Router();
import { check } from "express-validator";
import {
  getBookings,
  getUserBookings,
  getProviderBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController";
import { protect, authorize } from "../middleware/auth";

// Get all bookings - admin only
router.get("/", [protect, authorize("admin")], getBookings);

// Get user bookings
router.get("/me", protect, getUserBookings);

// Get provider bookings
router.get(
  "/provider",
  [protect, authorize("provider", "admin")],
  getProviderBookings
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
  createBooking
);

// Update booking status
router.put("/:id", protect, updateBookingStatus);

// Delete booking
router.delete("/:id", protect, deleteBooking);

export default router;
