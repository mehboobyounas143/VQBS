const Question = require('../models/Question');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const DifficultyLevel = require('../models/DifficultyLevel');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { questionText, type, options, correctAnswer, subject, topic, difficultyLevel } = req.body;

    // Validate related entities
    const foundSubject = await Subject.findById(subject);
    if (!foundSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const foundTopic = await Topic.findById(topic);
    if (!foundTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const foundDifficultyLevel = await DifficultyLevel.findById(difficultyLevel);
    if (!foundDifficultyLevel) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }

    // Create question
    const newQuestion = new Question({
      questionText,
      type,
      options,
      correctAnswer,
      subject,
      topic,
      difficultyLevel,
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question created successfully', question: newQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('subject')
      .populate('topic')
      .populate('difficultyLevel');
    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id)
      .populate('subject')
      .populate('topic')
      .populate('difficultyLevel');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, type, options, correctAnswer, subject, topic, difficultyLevel } = req.body;

    // Validate related entities
    const foundSubject = await Subject.findById(subject);
    if (!foundSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const foundTopic = await Topic.findById(topic);
    if (!foundTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const foundDifficultyLevel = await DifficultyLevel.findById(difficultyLevel);
    if (!foundDifficultyLevel) {
      return res.status(404).json({ error: 'Difficulty level not found' });
    }

    // Update question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { questionText, type, options, correctAnswer, subject, topic, difficultyLevel },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get questions by topic ID
const getQuestionsByTopicId = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { difficulty } = req.query;

    const query = { topic: topicId };

    // Resolve difficulty level if provided
    if (difficulty) {
      const difficultyDoc = await DifficultyLevel.findOne({ levelName: difficulty });
      if (!difficultyDoc) {
        return res.status(404).json({ error: `Difficulty level "${difficulty}" not found` });
      }
      query.difficultyLevel = difficultyDoc._id; // Add resolved ObjectId to the query
    }

    const questions = await Question.find(query)
      .populate('subject', 'name') // Populate only the name field from Subject
      .populate('topic', 'name')   // Populate only the name field from Topic
      .populate('difficultyLevel', 'levelName'); // Populate only the levelName field from DifficultyLevel

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this topic and difficulty level.' });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error in getQuestionsByTopicId:', error);
    res.status(500).json({ error: error.message });
  }
};

// New API: Get questions by difficulty level for a specific subject
const getQuestionsByDifficultyAndSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { difficulty } = req.query;

    // Build query object
    const query = { subject: subjectId };
    if (difficulty) {
      query.difficultyLevel = difficulty;
    }

    const questions = await Question.find(query)
      .populate('subject')
      .populate('topic')
      .populate('difficultyLevel');

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this criteria' });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTopicId,
  getQuestionsByDifficultyAndSubject, // Export the new API
};
