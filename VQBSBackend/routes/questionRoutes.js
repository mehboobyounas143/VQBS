// routes/questionRoutes.js

const express = require('express');
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionsByTopicId,
  getQuestionsByDifficultyAndSubject,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

const Question = require('../models/Question');
const router = express.Router();

/**
 * Global keyword search with Pagination
 * Example: /api/questions/search?keyword=math&page=1&limit=10
 */
router.get('/questions/search', async (req, res) => {
  const keyword = req.query.keyword;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required' });
  }

  try {
    const regex = new RegExp(keyword, 'i');

    // Paginated results
    const results = await Question.find({ questionText: { $regex: regex } })
      .populate('subject', 'subjectName')
      .populate('topic', 'topicName')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Question.countDocuments({ questionText: { $regex: regex } });

    res.json({
      questions: results,
      totalResults: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

/**
 * Search suggestions endpoint
 * Example: /api/questions/suggestions?keyword=math
 */
router.get('/questions/suggestions', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required' });
  }

  try {
    const regex = new RegExp(keyword, 'i');

    // Find top 5 quick suggestions
    const suggestions = await Question.find({ questionText: { $regex: regex } })
      .limit(5)
      .select('questionText') // Only return questionText field
      .lean();

    res.json({
      suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ message: 'Suggestions failed' });
  }
});

// Existing routes
router.post('/questions', createQuestion);
router.get('/questions', getAllQuestions);
router.get('/questions/topic/:topicId', getQuestionsByTopicId);
router.get('/questions/subject/:subjectId', getQuestionsByDifficultyAndSubject);
router.get('/questions/:id', getQuestionById);  // Keep this AFTER fixed routes like /search and /suggestions
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;
