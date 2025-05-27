// controllers/topicController.js
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const Question = require('../models/Question');

// Create a Topic
const createTopic = async (req, res) => {
  try {
    const { topicName, subject } = req.body;

    if (!topicName || !subject) {
      return res.status(400).json({ error: 'Topic name and subject are required' });
    }

    // Check if the Subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(400).json({ error: 'Subject not found' });
    }

    const newTopic = new Topic({ topicName, subject });
    await newTopic.save();
    res.status(201).json({ message: 'Topic created successfully', topic: newTopic });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Topic name must be unique' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all Topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('subject', 'subjectName');
    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Topic by ID
const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id).populate('subject', 'subjectName');
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Topic
const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { topicName, subject } = req.body;

    if (!topicName || !subject) {
      return res.status(400).json({ error: 'Topic name and subject are required' });
    }

    // Check if the Subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(400).json({ error: 'Subject not found' });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(id, { topicName, subject }, { new: true });
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.status(200).json({ message: 'Topic updated successfully', topic: updatedTopic });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Topic name must be unique' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a Topic
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Topics by Subject ID
// Get Topics by Subject ID
const getTopicsBySubjectId = async (req, res) => {
  try {
    const { subjectId } = req.params;  // Extract subjectId from request params

    // Fetch topics with the subject populated
    const topics = await Topic.find({ subject: subjectId }).populate('subject', 'subjectName');

    if (topics.length === 0) {
      return res.status(404).json({ message: 'No topics found for this subject' });
    }

    // Add question count for each topic
    const topicsWithQuestionCount = await Promise.all(
      topics.map(async (topic) => {
        const questionCount = await Question.countDocuments({ topic: topic._id });
        return { ...topic._doc, questionCount };
      })
    );

    res.status(200).json({ topics: topicsWithQuestionCount });
  } catch (error) {
    console.error('Error fetching topics by subject ID:', error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
  getTopicsBySubjectId,
};
