const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const upload = require('../middleware/upload');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/photoController');

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many uploads. Try again later.' },
});

const uploadValidation = [
  body('locationKey').trim().notEmpty().withMessage('locationKey is required'),
  body('year').isInt({ min: 1400, max: 2100 }).withMessage('year must be 1400-2100'),
  body('caption').trim().isLength({ min: 2, max: 500 }).withMessage('caption 2-500 chars'),
  body('firstName').trim().isLength({ min: 1, max: 80 }).withMessage('firstName required'),
  body('lastName').trim().isLength({ min: 1, max: 80 }).withMessage('lastName required'),
  body('email').isEmail().withMessage('valid email required'),
];

router.get('/', ctrl.listApproved);
router.get('/admin/pending', protect, adminOnly, ctrl.getPendingPhotos);
router.get('/:locationKey', ctrl.getPhotosByLocation);
router.post('/', uploadLimiter, optionalAuth, upload.single('image'), uploadValidation, ctrl.uploadPhoto);
router.patch('/:id/moderate', protect, adminOnly, ctrl.moderatePhoto);

module.exports = router;
