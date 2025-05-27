// controllers/difficultyLevelController.js
const DifficultyLevel = require('../models/DifficultyLevel');

// Create a new Difficulty Level
const createDifficultyLevel = async (req, res) => {
  try {
    const { levelName } = req.body;

    if (!levelName) {
      return res.status(400).json({ error: 'Level name is required' });
    }

    const newDifficultyLevel = new DifficultyLevel({ levelName });
    await newDifficultyLevel.save();
    res.status(201).json({ message: 'Difficulty Level created successfully', difficultyLevel: newDifficultyLevel });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Level name must be unique' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all Difficulty Levels
const getAllDifficultyLevels = async (req, res) => {
  try {
    const difficultyLevels = await DifficultyLevel.find();
    res.status(200).json({ difficultyLevels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get Difficulty Level by ID
const getDifficultyLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const difficultyLevel = await DifficultyLevel.findById(id);
    if (!difficultyLevel) {
      return res.status(404).json({ message: 'Difficulty Level not found' });
    }
    res.status(200).json({ difficultyLevel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update Difficulty Level
const updateDifficultyLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { levelName } = req.body;

    if (!levelName) {
      return res.status(400).json({ error: 'Level name is required' });
    }

    const difficultyLevel = await DifficultyLevel.findByIdAndUpdate(id, { levelName }, { new: true });
    if (!difficultyLevel) {
      return res.status(404).json({ message: 'Difficulty Level not found' });
    }

    res.status(200).json({ message: 'Difficulty Level updated successfully', difficultyLevel });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Level name must be unique' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Difficulty Level
const deleteDifficultyLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const difficultyLevel = await DifficultyLevel.findByIdAndDelete(id);
    if (!difficultyLevel) {
      return res.status(404).json({ message: 'Difficulty Level not found' });
    }
    res.status(200).json({ message: 'Difficulty Level deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDifficultyLevel,
  getAllDifficultyLevels,
  getDifficultyLevelById,
  updateDifficultyLevel,
  deleteDifficultyLevel,
};
