const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const newStudent = new Student({ firstName, lastName, email, dateOfBirth, password });
    await newStudent.save();

    res.status(201).json({ student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, student });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(); // Removed .populate('subjects')
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id); // Removed .populate('subjects')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  debugger;
  try {
    const { id } = req.params;
    const { firstName, lastName, email, dateOfBirth, password } = req.body;

    if (password) {
      // Hash the password if provided
      req.body.password = await bcrypt.hash(password, 10);
    }

    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout student and clear token cookie
const logoutStudent = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent,
  logoutStudent
};
