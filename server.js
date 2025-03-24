const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { router: authRouter, authMiddleware } = require('./routes/auth');
const employeeRouter = require('./routes/employees');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow React frontend origin

// Serve static files (including index.html)
app.use(express.static(path.join(__dirname)));

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Protected route for testing token
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ msg: 'This is a protected route', adminId: req.admin.id });
});

// Auth routes
app.use('/api/auth', authRouter);

// Employee routes
app.use('/api/employees', employeeRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));