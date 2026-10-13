import mongoose from 'mongoose';

export const SESSION_CATEGORIES = [
  'Notes',
  'Coding',
  'Presentation Practice',
  'Academic Support',
  'Other',
];

export const SESSION_STATUSES = ['Open', 'Booked', 'Completed', 'Cancelled'];

const sessionSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: SESSION_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    skillOffered: {
      type: String,
      trim: true,
      default: '',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [10, 'Duration must be at least 10 minutes'],
      max: [240, 'Duration cannot exceed 240 minutes'],
      default: 45,
    },
    timeSlot: {
      type: String, // String or ISO date string (e.g., '2026-10-15T15:30:00' or 'Tomorrow at 4 PM')
      required: [true, 'Time slot or preferred schedule is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: SESSION_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Open',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for category and status filtering
sessionSchema.index({ status: 1, category: 1, createdAt: -1 });

// Text search index for title, description, and skillOffered
sessionSchema.index({
  title: 'text',
  description: 'text',
  skillOffered: 'text',
});

export const Session = mongoose.model('Session', sessionSchema);
