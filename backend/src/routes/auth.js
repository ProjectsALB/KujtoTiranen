const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 40 });

router.post('/register', authLimiter, [
  body('name').trim().isLength({ min: 2 }).withMessage('Emri min. 2 karaktere'),
  body('email').isEmail().withMessage('Email i pavlefshëm'),
  body('password').isLength({ min: 6 }).withMessage('Password min. 6 karaktere'),
], ctrl.register);

router.get('/oauth-config', ctrl.oauthConfig);
router.post('/google', authLimiter, ctrl.googleLogin);

router.post('/login', authLimiter, [
  body('email').optional(),
  body('password').optional(),
], ctrl.login);

router.get('/me', protect, ctrl.me);
router.post('/change-password', protect, ctrl.changePassword);
router.post('/favorites', protect, ctrl.toggleFavorite);

module.exports = router;
