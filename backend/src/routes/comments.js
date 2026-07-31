const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { optionalAuth, protect } = require('../middleware/auth');
const ctrl = require('../controllers/commentController');

const router = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.get('/:locationKey', ctrl.getComments);
router.post(
  '/:locationKey',
  limiter,
  optionalAuth,
  [
    body('text').trim().isLength({ min: 2, max: 1000 }),
    body('authorName').optional().trim().isLength({ max: 80 }),
  ],
  ctrl.addComment
);
router.post('/like/:id', protect, ctrl.likeComment);

module.exports = router;
