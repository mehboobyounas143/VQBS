const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    let updateFields = { firstName, lastName, email };

    if (password) {
      updateFields.password = await bcrypt.hash(password, 10); // Hash the password
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  console.log(req);
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByCredentials(email, password);

    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = await admin.generateAuthToken();
    res.status(200).json({ admin, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const logoutAdmin = async (req, res) => {
  try {
    const admin = req.admin;
    admin.tokens = admin.tokens.filter(token => token.token !== req.token);
    await admin.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin
};
