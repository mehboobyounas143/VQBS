const express = require('express');
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
} = require('../controllers/reportController');

const router = express.Router();

// Report Routes
router.post('/reports', createReport);
router.get('/reports', getAllReports);
router.get('/reports/:id', getReportById);
router.put('/reports/:id', updateReport);
router.delete('/reports/:id', deleteReport);

module.exports = router;
