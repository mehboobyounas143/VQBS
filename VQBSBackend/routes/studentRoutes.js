const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent,
  logoutStudent
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

module.exports = router;
