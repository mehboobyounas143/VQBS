const express = require('express');
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin
} = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/admins', createAdmin);
router.post('/admins/login', loginAdmin);
router.get('/admins', getAllAdmins);
router.get('/admins/:id', auth, getAdminById);
router.put('/admins/:id', auth, updateAdmin);
router.delete('/admins/:id', auth, deleteAdmin);
router.post('/admins/logout', auth, logoutAdmin);

module.exports = router;
