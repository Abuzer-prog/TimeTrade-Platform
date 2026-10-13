import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['Pending', 'Accepted', 'Rejected', 'Cancelled'];

const bookingSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session reference is required'],
      index: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester reference is required'],
      index: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Session creator reference is required'],
      index: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: BOOKING_STATUSES,
        message: '{VALUE} is not a valid booking status',
      },
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending bookings from the same user on the same session
bookingSchema.index({ session: 1, requester: 1, status: 1 });
bookingSchema.index({ creator: 1, status: 1, createdAt: -1 });

export const Booking = mongoose.model('Booking', bookingSchema);
