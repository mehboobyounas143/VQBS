const Response = require('../models/Response');
const Question = require('../models/Question');
const Student = require('../models/Student');

// Create a new response
const createResponse = async (req, res) => {
  try {
    const { studentId, responses } = req.body;

    // Log the incoming data to verify it
    console.log('Received data:', req.body);

    // Validate required fields
    if (!studentId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: "Missing required fields or invalid data" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Save all responses in a batch
    const newResponses = await Promise.all(
      responses.map(async ({ questionId, answer, isCorrect }) => {
        if (!questionId || typeof isCorrect !== 'boolean') {
          throw new Error("Missing required fields in response data");
        }

        const question = await Question.findById(questionId)
          .populate('subject')
          .populate('topic');

        if (!question) {
          throw new Error(`Question with ID ${questionId} not found`);
        }

        const { topic, subject } = question;
        if (!topic || !subject) {
          throw new Error(`Topic or Subject missing in Question with ID ${questionId}`);
        }

        const newResponse = new Response({
          student: studentId,
          question: questionId,
          answer,
          isCorrect,
          topicId: topic._id,
          subjectId: subject._id,
        });

        return newResponse.save();
      })
    );

    res.status(201).json({ message: "Responses saved successfully", responses: newResponses });
  } catch (error) {
    console.error('Error creating responses:', error);
    res.status(500).json({ error: error.message });
  }
};

const getResponsesBySubjectStats = async (req, res) => {
  try {
    console.log("::::::::::: Start Aggregation :::::::::::");
    const stats = await Response.aggregate([
      {
        $group: {
          _id: '$subjectId',
          uniqueStudents: { $addToSet: '$student' },
        },
      },
      {
        $project: {
          subjectId: '$_id',
          studentCount: { $size: '$uniqueStudents' },
          _id: 0,
        },
      },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subjectId',
          foreignField: '_id',
          as: 'subjectDetails',
        },
      },
      {
        $unwind: { path: '$subjectDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          subjectName: '$subjectDetails.subjectName', // Extract the subjectName field
          studentCount: 1, // Retain the student count
        },
      },
    ]);
    res.status(200).json({ stats });
  } catch (error) {
    console.error('Error in getResponsesBySubjectStats:', error);
    res.status(500).json({ error: 'Failed to fetch subject stats' });
  }
};

// Get responses by student
const getResponsesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const responses = await Response.find({ student: studentId })
      .populate('question')
      .populate('topicId')
      .populate('subjectId');
    if (!responses.length) {
      return res.status(404).json({ message: "No responses found for this student" });
    }

    res.status(200).json({ responses });
  } catch (error) {
    console.error('Error fetching responses by student:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get responses by question
const getResponsesByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const responses = await Response.find({ question: questionId })
      .populate('student')
      .populate('topicId')
      .populate('subjectId');
    if (!responses.length) {
      return res.status(404).json({ message: "No responses found for this question" });
    }

    res.status(200).json({ responses });
  } catch (error) {
    console.error('Error fetching responses by question:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get response by ID
const getResponseById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Response.findById(id)
      .populate('student question')
      .populate('topicId')
      .populate('subjectId');
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error fetching response by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get responses by subject
const getResponsesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const responses = await Response.find({ subjectId })
      .populate('question')
      .populate('topicId')
      .populate('subjectId');
    if (!responses.length) {
      return res.status(404).json({ message: "No responses found for this subject" });
    }

    res.status(200).json({ responses });
  } catch (error) {
    console.error('Error fetching responses by subject:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get responses by topic
const getResponsesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const responses = await Response.find({ topicId })
      .populate('question')
      .populate('topicId')
      .populate('subjectId');
    if (!responses.length) {
      return res.status(404).json({ message: "No responses found for this topic" });
    }

    res.status(200).json({ responses });
  } catch (error) {
    console.error('Error fetching responses by topic:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all responses
const getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find({})
      .populate('question')
      .populate('topicId')
      .populate('subjectId');

    if (!responses.length) {
      return res.status(404).json({ message: "No responses found" });
    }

    res.status(200).json({ responses });
  } catch (error) {
    console.error('Error fetching all responses:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createResponse,
  getResponsesByStudent,
  getResponsesByQuestion,
  getResponseById,
  getResponsesBySubject,
  getResponsesByTopic,
  getAllResponses,
  getResponsesBySubjectStats, // Export the new controller
};
