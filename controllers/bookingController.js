import Booking, { find, findById } from '../models/Booking';
  import { findById as _findById } from '../models/Service';
  import { validationResult } from 'express-validator';
  
  // @desc    Get all bookings (for admin)
  // @route   GET /api/bookings
  // @access  Private (Admin)
  export async function   getBookings(req, res) {
    try {
      const bookings = await find()
        .populate('user', 'name email')
        .populate('service', 'name')
        .populate('provider', 'name');
  
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  // @desc    Get user bookings
  // @route   GET /api/bookings/me
  // @access  Private
  export async function   getUserBookings(req, res) {
    try {
      const bookings = await find({ user: req.user.id })
        .populate('service', 'name image')
        .populate('provider', 'name');
  
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  // @desc    Get provider bookings
  // @route   GET /api/bookings/provider
  // @access  Private (Provider)
  export async function   getProviderBookings(req, res) {
    try {
      const bookings = await find({ provider: req.user.id })
        .populate('user', 'name email phone')
        .populate('service', 'name');
  
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  // @desc    Create booking clogs every task when I need to
  // @route   POST /api/bookings
  // @access  Private
  export async function   createBooking(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { service: serviceId, date, time, specialRequests } = req.body;
  
      // Get service to check if it exists and get the price
      const service = await _findById(serviceId);
  
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
  
      // Create the booking
      const booking = new Booking({
        user: req.user.id,
        service: serviceId,
        provider: service.provider,
        date,
        time,
        price: service.priceRange.min, // Using minimum price as default
        specialRequests
      });
  
      const savedBooking = await booking.save();
  
      res.status(201).json({
        success: true,
        data: savedBooking
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  // @desc    Update booking status
  // @route   PUT /api/bookings/:id
  // @access  Private (User/Provider/Admin)
  export async function   updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      
      const booking = await findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
  
      // Make sure user owns this booking or is the provider or admin
      if (
        booking.user.toString() !== req.user.id &&
        booking.provider.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this booking'
        });
      }
  
      booking.status = status;
      const updatedBooking = await booking.save();
  
      res.json({
        success: true,
        data: updatedBooking
      });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  // @desc    Delete booking
  // @route   DELETE /api/bookings/:id
  // @access  Private (User/Admin)
  export async function   deleteBooking(req, res) {
    try {
      const booking = await findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
  
      // Make sure user owns this booking or is admin
      if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to delete this booking'
        });
      }
  
      await booking.remove();
  
      res.json({
        success: true,
        data: {}
      });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
