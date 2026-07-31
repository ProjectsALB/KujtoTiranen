const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    locationKey: { type: String, required: true, index: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, trim: true, lowercase: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
