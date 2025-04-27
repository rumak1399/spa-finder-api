import express from 'express';
import { check } from 'express-validator';
import { createBooking, deleteBooking, getBookings, getProviderBookings, getUserBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings - admin only
router.get(
  '/',
  [protect, authorize('admin')],
  getBookings
);

// Get user bookings
router.get('/me', protect, getUserBookings);

// Get provider bookings
router.get(
  '/provider',
  [protect, authorize('provider', 'admin')],
   getProviderBookings
);

// Create booking
router.post(
  '/',
  [
    protect,
    [
      check('service', 'Service is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty().isDate(),
      check('time', 'Time is required').not().isEmpty()
    ]
  ],
   createBooking
);

// Update booking status
router.put(
  '/:id',
  protect,
   updateBookingStatus
);

// Delete booking
router.delete(
  '/:id',
  protect,
   deleteBooking
);

export default router;
