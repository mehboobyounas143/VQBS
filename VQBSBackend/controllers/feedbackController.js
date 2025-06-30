const Feedback = require('../models/Feedback');

// Submit feedback controller
exports.submitFeedback = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId are required.' });
    }

    const feedback = new Feedback({
      message,
      userId,
      submittedAt: new Date(),
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};


// Get all feedbacks controller (for admin)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'email') // populate these student fields
      .sort({ submittedAt: -1 });
    
    res.json({ feedbacks });
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
