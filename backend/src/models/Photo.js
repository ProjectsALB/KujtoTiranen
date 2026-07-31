const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    locationKey: { type: String, required: true, index: true, trim: true },
    year: { type: Number, required: true, min: 1400, max: 2100 },
    caption: { type: String, required: true, trim: true, maxlength: 500 },
    imageUrl: { type: String, required: true },
    imagePath: { type: String },
    contributor: {
      firstName: { type: String, required: true, trim: true, maxlength: 80 },
      lastName: { type: String, required: true, trim: true, maxlength: 80 },
      email: { type: String, required: true, trim: true, lowercase: true },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    moderatedAt: { type: Date },
  },
  { timestamps: true }
);

photoSchema.index({ locationKey: 1, status: 1, year: 1 });

module.exports = mongoose.model('Photo', photoSchema);
