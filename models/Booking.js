import { Schema } from "mongoose";

const ServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  provider: {
    type:  Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type:  Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  priceRange: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  availability: [
    {
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      startTime: String,
      endTime: String,
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  ],
  ratings: [
    {
      user: {
        type:  Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create geospatial index for location
ServiceSchema.index({ location: '2dsphere' });

// Calculate average rating before saving
ServiceSchema.pre('save', function (next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.totalReviews = this.ratings.length;
  }
  next();
});

export const Service =  model('Service', ServiceSchema);

