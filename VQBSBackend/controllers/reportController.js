const Report = require('../models/Report');
const Student = require('../models/Student');  // Assuming the Student model exists

// Create a Report
const createReport = async (req, res) => {
  try {
    const { student, score, date } = req.body;

    // Validate if student exists
    const existingStudent = await Student.findById(student);
    if (!existingStudent) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Validate score field
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Invalid score. It should be a number between 0 and 100' });
    }

    // Validate date field (if provided)
    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // If date is not provided, set it to the current date
    const reportDate = date ? new Date(date) : new Date();

    // Create and save the report
    const newReport = new Report({ student, score, date: reportDate });
    await newReport.save();

    res.status(201).json({ report: newReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('student');
    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id).populate('student');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, date } = req.body;

    // Validate score field
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Invalid score. It should be a number between 0 and 100' });
    }

    // Validate date field (if provided)
    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // If date is provided, use it, otherwise, keep the existing date
    const reportDate = date ? new Date(date) : undefined;

    const updatedReport = await Report.findByIdAndUpdate(id, { score, date: reportDate }, { new: true });

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ report: updatedReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
};
