// routes/topicRoutes.js
const express = require('express');
const {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
  getTopicsBySubjectId,
} = require('../controllers/topicController');

const router = express.Router();

router.post('/topics', createTopic);
router.get('/topics', getAllTopics);
router.get('/topics/:id', getTopicById);
router.put('/topics/:id', updateTopic);
router.delete('/topics/:id', deleteTopic);
router.get('/topics/subject/:subjectId', getTopicsBySubjectId);

module.exports = router;
