const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent,
  logoutStudent,
  verifyStudentEmail // ✅ Added verification handler
} = require('../controllers/studentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/students', createStudent);

router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.post('/students/login', loginStudent);
router.post('/students/logout', auth, logoutStudent);

// ✅ Add this route to handle email verification via token
router.get('/students/verify/:token', verifyStudentEmail);

module.exports = router;
