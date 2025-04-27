import { model, Schema } from "mongoose";

const BookingSchema = new  Schema({
  user: {
    type:  Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type:  Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  provider: {
    type:  Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  specialRequests: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Use export default to export the model
export default model('Booking', BookingSchema);
