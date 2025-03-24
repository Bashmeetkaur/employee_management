const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['developer', 'manager', 'designer', 'other'],
      message: 'Role must be one of: developer, manager, designer, other'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Reference to the Admin model
    default: null
  }
});

module.exports = mongoose.model('Employee', employeeSchema);