const express = require('express');
const router = express.Router();
const {submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');

// Submit feedback
router.post('/', submitFeedback);

// Get all feedbacks (for admin)
router.get('/', getAllFeedbacks);

module.exports = router;
