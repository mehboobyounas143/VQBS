const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');

const router = express.Router();

// Serve static files from uploads folder at /uploads route
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');  // make sure uploads folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post('/subjects', upload.single('image'), createSubject);
router.get('/subjects', getAllSubjects);
router.get('/subjects/:id', getSubjectById);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

module.exports = router;
