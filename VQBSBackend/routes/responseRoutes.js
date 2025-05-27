const express = require('express');
const {
  createResponse,
  getResponsesByStudent,
  getResponsesByQuestion,
  getResponseById,
  getResponsesBySubject,
  getResponsesByTopic,
  getAllResponses,
  getResponsesBySubjectStats, // New function
} = require('../controllers/responseController');
const auth = require('../middleware/auth');

const router = express.Router();

// Existing routes
router.get('/responses/subjectStats', getResponsesBySubjectStats);
router.post('/responses', createResponse);
router.get('/responses/student/:studentId', getResponsesByStudent);
router.get('/responses/question/:questionId', auth, getResponsesByQuestion);
router.get('/responses/:id', getResponseById);

// New routes for fetching responses by subject and topic
router.get('/responses/subject/:subjectId', auth, getResponsesBySubject);
router.get('/responses/topic/:topicId', auth, getResponsesByTopic);

// New route for subject stats


// Fetch all responses
router.get('/responses', getAllResponses);

module.exports = router;
