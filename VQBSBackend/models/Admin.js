const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

adminSchema.methods.generateAuthToken = async function() {
  const admin = this;
  const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Unable to login: Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Unable to login: Invalid email or password');
  }
  return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
