const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: (value) => value < Date.now(), // Ensure the date is in the past
      message: 'Date of birth must be in the past'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  }
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  const student = this;

  if (!student.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(student.password, salt);
    student.password = hashedPassword;
    next();
  } catch (error) {
    next(new Error('Password hashing failed.'));
  }
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  const student = this;
  try {
    return await bcrypt.compare(candidatePassword, student.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('Student', studentSchema);
