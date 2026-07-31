const { validationResult } = require('express-validator');
const Photo = require('../models/Photo');
const { moderatePhotoMeta } = require('../utils/moderation');
const { notifyNewPhoto } = require('../utils/mailer');

exports.getPhotosByLocation = async (req, res, next) => {
  try {
    const photos = await Photo.find({ locationKey: req.params.locationKey, status: 'approved' })
      .sort({ year: 1 })
      .select('-contributor.email -__v');
    res.json({ success: true, count: photos.length, data: photos });
  } catch (err) {
    next(err);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array(), message: errors.array()[0]?.msg });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const { locationKey, year, caption, firstName, lastName, email } = req.body;

    const mod = moderatePhotoMeta({ caption, locationKey, year });
    if (!mod.ok) {
      return res.status(400).json({
        success: false,
        message: `Foto/komenti u refuzua automatikisht: ${mod.reason}. Nuk u dërgua te admini.`,
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const photo = await Photo.create({
      locationKey: String(locationKey).trim().toLowerCase(),
      year: Number(year),
      caption: caption.trim(),
      imageUrl,
      imagePath: req.file.path,
      contributor: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
      },
      user: req.user ? req.user._id : null,
      status: 'pending',
    });

    try {
      await notifyNewPhoto(photo);
    } catch (e) {
      console.error('notify email failed', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Foto u ngarkua. Do të shfaqet pas miratimit të adminit. Admini u njoftua me email.',
      data: { id: photo._id, locationKey: photo.locationKey, year: photo.year, status: photo.status },
    });
  } catch (err) {
    next(err);
  }
};

exports.getPendingPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, count: photos.length, data: photos });
  } catch (err) {
    next(err);
  }
};

exports.moderatePhoto = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be approved or rejected' });
    }
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { status, moderatedBy: req.user._id, moderatedAt: new Date() },
      { new: true }
    );
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
    res.json({ success: true, data: photo });
  } catch (err) {
    next(err);
  }
};

exports.listApproved = async (req, res, next) => {
  try {
    const filter = { status: 'approved' };
    if (req.query.locationKey) filter.locationKey = req.query.locationKey;
    if (req.query.yearFrom || req.query.yearTo) {
      filter.year = {};
      if (req.query.yearFrom) filter.year.$gte = Number(req.query.yearFrom);
      if (req.query.yearTo) filter.year.$lte = Number(req.query.yearTo);
    }
    const photos = await Photo.find(filter).sort({ year: 1 }).limit(200);
    res.json({ success: true, count: photos.length, data: photos });
  } catch (err) {
    next(err);
  }
};
