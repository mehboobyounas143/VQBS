// models/Topic.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
