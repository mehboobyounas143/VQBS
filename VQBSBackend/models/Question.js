const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'TrueFalse', 'Descriptive'],
    required: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (v) {
        return this.type === 'Descriptive' || (Array.isArray(v) && v.length > 0);
      },
      message: 'Options are required for MCQ or TrueFalse questions.',
    },
    default: [],
  },
  correctAnswer: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === 'Descriptive' || (v && v.length > 0);
      },
      message: 'Correct answer is required for MCQ or TrueFalse questions.',
    },
    default: '',
  },
  keywords: {
    type: [String],
    default: [], // Only used for Descriptive questions
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
