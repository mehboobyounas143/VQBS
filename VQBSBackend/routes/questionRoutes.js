const express = require('express');
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionsByTopicId,
  getQuestionsByDifficultyAndSubject, // Add this import
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

const router = express.Router();

// Routes for managing questions
router.post('/questions', createQuestion);                       // Create a new question
router.get('/questions', getAllQuestions);                      // Get all questions
router.get('/questions/:id', getQuestionById);                  // Get a question by ID
router.get('/questions/topic/:topicId', getQuestionsByTopicId); // Get questions by topic ID
router.get(
  '/questions/subject/:subjectId',
  getQuestionsByDifficultyAndSubject
); // New route: Get questions by subject and difficulty level
router.put('/questions/:id', updateQuestion);                   // Update a question by ID
router.delete('/questions/:id', deleteQuestion);                // Delete a question by ID

module.exports = router;
