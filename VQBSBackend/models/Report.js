const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // default to the current date if not provided
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
