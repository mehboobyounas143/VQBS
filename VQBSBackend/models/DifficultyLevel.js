// models/DifficultyLevel.js
const mongoose = require('mongoose');

const difficultyLevelSchema = new mongoose.Schema({
  levelName: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('DifficultyLevel', difficultyLevelSchema);
