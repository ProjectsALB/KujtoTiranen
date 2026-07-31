const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/contactController');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages. Try again later.' },
});

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('name required'),
    body('email').isEmail().withMessage('valid email required'),
    body('phone').optional().trim().isLength({ max: 40 }),
    body('message').trim().isLength({ min: 10, max: 3000 }).withMessage('message 10-3000 chars'),
  ],
  ctrl.submitContact
);

module.exports = router;
