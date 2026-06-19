const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const { feedbackValidator } = require('../validators/feedbackValidator');
const { validate } = require('../middlewares/validateRequest');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many feedback submissions from this IP, please try again after 15 minutes'
  }
});

router.post('/', feedbackLimiter, validate(feedbackValidator), submitFeedback);

module.exports = router;
