const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const fs = require('fs');
const path = require('path');

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;
    if (!subjectName) {
      return res.status(400).json({ error: 'Subject name is required' });
    }

    const image = req.file;

    const newSubject = new Subject({
      subjectName,
      imagePath: image ? image.path : null,
      icon: image ? image.filename : null,
    });

    await newSubject.save();
    res.status(201).json({ subject: newSubject });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Subject name must be unique' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all subjects with counts
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();

    const subjectsWithCounts = await Promise.all(subjects.map(async (subject) => {
      const topicsCount = await Topic.countDocuments({ subject: subject._id });
      const questionsCount = await Question.countDocuments({ subject: subject._id });

      return {
        ...subject.toObject(),
        topicsCount,
        questionsCount,
        icon: subject.icon || null,
      };
    }));

    res.status(200).json({ subjects: subjectsWithCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject', error });
  }
};

// Update subject by ID
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Handle image update if a new file is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (subject.imagePath) {
        fs.unlink(path.resolve(subject.imagePath), (err) => {
          if (err) console.error('Error deleting old image:', err.message);
        });
      }

      subject.imagePath = req.file.path;
      subject.icon = req.file.filename;
    }

    // Update name if provided
    if (subjectName) {
      subject.subjectName = subjectName;
    }

    await subject.save();
    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Subject name must be unique' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete subject by ID (including topics, questions, and image)
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Delete related topics and questions
    await Topic.deleteMany({ subject: id });
    await Question.deleteMany({ subject: id });

    // Delete image file if exists
    if (subject.imagePath) {
      fs.unlink(path.resolve(subject.imagePath), (err) => {
        if (err) {
          console.error('Failed to delete image:', err.message);
        }
      });
    }

    // Delete subject
    await Subject.findByIdAndDelete(id);

    res.status(200).json({ message: 'Subject, topics, and questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all controllers
module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
