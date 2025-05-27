// routes/difficultyLevelRoutes.js
const express = require('express');
const {
  createDifficultyLevel,
  getAllDifficultyLevels,
  getDifficultyLevelById,
  updateDifficultyLevel,
  deleteDifficultyLevel,
} = require('../controllers/difficultyLevelController');

const router = express.Router();

router.post('/difficultyLevels', createDifficultyLevel);
router.get('/difficultyLevels', getAllDifficultyLevels);
router.get('/difficultyLevels/:id', getDifficultyLevelById);
router.put('/difficultyLevels/:id', updateDifficultyLevel);
router.delete('/difficultyLevels/:id', deleteDifficultyLevel);

module.exports = router;
