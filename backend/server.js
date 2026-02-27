// Load environment variables FIRST before anything else
require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/provider', require('./routes/providerRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/queue', require('./routes/queueRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
