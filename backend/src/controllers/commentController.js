const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const { moderateText } = require('../utils/moderation');
const { notifyNewComment } = require('../utils/mailer');

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      locationKey: req.params.locationKey,
      status: 'approved',
      parentId: null,
    })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0]?.msg });
    }
    const { text, authorName, authorEmail, parentId } = req.body;
    const locationKey = req.params.locationKey;

    const mod = moderateText(text);
    if (!mod.ok) {
      return res.status(400).json({
        success: false,
        message: `Komenti u refuzua: ${mod.reason}`,
      });
    }

    const comment = await Comment.create({
      locationKey,
      text: text.trim(),
      authorName: (authorName || req.user?.name || 'Anon').trim(),
      authorEmail: (authorEmail || req.user?.email || '').trim().toLowerCase(),
      user: req.user?._id || null,
      parentId: parentId || null,
      status: 'approved',
    });

    try {
      await notifyNewComment(comment);
    } catch (_) {}

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required to like' });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Not found' });
    const uid = req.user._id.toString();
    const idx = comment.likes.findIndex((id) => id.toString() === uid);
    if (idx >= 0) {
      comment.likes.splice(idx, 1);
    } else {
      comment.likes.push(req.user._id);
    }
    comment.likeCount = comment.likes.length;
    await comment.save();
    res.json({ success: true, likeCount: comment.likeCount, liked: idx < 0 });
  } catch (err) {
    next(err);
  }
};
