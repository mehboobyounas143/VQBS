const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // ✅ Correct reference
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Feedback', FeedbackSchema);
