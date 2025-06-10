const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Question = require('../models/Question');

exports.globalSearch = async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required' });
  }

  try {
    // Search in subjects
    const subjects = await Subject.find({
      subjectName: { $regex: keyword, $options: 'i' }
    });

    // Search in topics
    const topics = await Topic.find({
      topicName: { $regex: keyword, $options: 'i' }
    }).populate('subject');

    // Search in questions
    const questions = await Question.find({
      questionText: { $regex: keyword, $options: 'i' }
    }).populate('subject').populate('topic');

    res.json({
      subjects,
      topics,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
