// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String, // This will store the image filename (e.g., "biology.jpg")
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
