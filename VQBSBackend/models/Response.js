const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',  // Assuming you have a Topic model
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',  // Assuming you have a Subject model
    required: true
  }
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
