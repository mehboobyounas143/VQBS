const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (req.baseUrl.includes('admins')) {
      user = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });
    } else if (req.baseUrl.includes('students')) {
      user = await Student.findOne({ _id: decoded._id, 'tokens.token': token });
    }

    if (!user) {
      console.error('Authentication failed: No user found for token');
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;
