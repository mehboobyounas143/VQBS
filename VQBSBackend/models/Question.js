const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,  // Changed from ObjectId to String
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  difficultyLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DifficultyLevel',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
