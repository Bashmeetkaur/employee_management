const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Validation middleware
const validateEmployee = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['developer', 'manager', 'designer', 'other']).withMessage('Invalid role')
];

// Create an employee
router.post('/', authMiddleware, validateEmployee, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, role } = req.body;
  try {
    const employee = new Employee({ name, email, role });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all employees
router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find().populate('lastUpdatedBy', 'username');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Read a single employee by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('lastUpdatedBy', 'username');
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an employee
router.put('/:id', authMiddleware, validateEmployee, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, role } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, role, lastUpdatedBy: req.admin.id }, // Store the admin's ID
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'username');
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an employee
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });
    res.json({ msg: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;