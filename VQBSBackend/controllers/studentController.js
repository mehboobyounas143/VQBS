const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      verificationToken
    });

    await newStudent.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newStudent.email,
      subject: 'VQBS Email Verification',
      html: `
        <h2>VQBS Email Verification</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${process.env.FRONTEND_URL}/verify/${verificationToken}">Verify Email</a>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyStudentEmail = async (req, res) => {
  try {
    const student = await Student.findOne({ verificationToken: req.params.token });

    if (!student) {
      return res.status(400).send('Invalid or expired verification token');
    }

    student.isVerified = true;
    student.verificationToken = undefined;
    await student.save();

    res.send('Email verified successfully! You can now log in.');
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).send('Internal server error');
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!student.isVerified) {
      return res.status(400).json({ error: 'Please verify your email before logging in.' });
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

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const updateStudent = async (req, res) => {
  debugger;
  try {
    const { id } = req.params;
    const { firstName, lastName, email, dateOfBirth, password } = req.body;

    if (password) {
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
  logoutStudent,
  verifyStudentEmail
};
