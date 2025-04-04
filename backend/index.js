require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendThankYouEmail, initiateSurveyEmailSequence } = require('./services/emailService');
const Booking = require('./models/Booking');
const SurveyResponse = require('./models/SurveyResponse');
const Admin = require('./models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const surveyQuestions = require('./constants/surveyQuestions');
const initEmailScheduler = require('./services/emailScheduler');
initEmailScheduler();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || FRONTEND_URL === '*' || FRONTEND_URL.split(',').includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => console.error('MongoDB connection error:', err));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Updated Survey Response Endpoint with Email Sequence
app.post('/api/survey-responses', async (req, res) => {
  try {
    const { name, email, answers } = req.body;

    if (!name || !email || !answers) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, or answers' 
      });
    }

    const newResponse = new SurveyResponse({
      name,
      email,
      answers
    });

    await newResponse.save();
    
    // Initiate the email sequence with original schedule (days 1,2,3,4,6,8,10,11)
    await initiateSurveyEmailSequence(email, name);
    
    res.status(201).json({ 
      message: 'Survey response saved successfully. Email sequence started.',
      responseId: newResponse._id,
      emailSchedule: [
        { day: 1, scheduled: '24 hours from now' },
        { day: 2, scheduled: '48 hours from now' },
        { day: 3, scheduled: '72 hours from now' },
        { day: 4, scheduled: '96 hours from now' },
        { day: 6, scheduled: '144 hours from now' },
        { day: 8, scheduled: '192 hours from now' },
        { day: 10, scheduled: '240 hours from now' },
        { day: 11, scheduled: '264 hours from now' }
      ]
    });
  } catch (err) {
    console.error('Survey response error:', err);
    res.status(500).json({ 
      message: 'Failed to save survey response',
      error: err.message
    });
  }
});

// Original Booking Endpoint (unchanged)
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, email, date, time, company, service } = req.body;

    if (!name || !email || !date || !time || !service) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const newBooking = new Booking({
      name,
      phone: phone || undefined,
      email,
      date,
      time,
      company: company || undefined,
      service,
    });

    await newBooking.save();

    try {
      await sendThankYouEmail(email, name, date, time, service);
      res.status(201).json({ 
        message: 'Booking saved successfully', 
        emailSent: true,
        bookingId: newBooking._id
      });
    } catch (emailErr) {
      console.error('Email error:', emailErr);
      res.status(201).json({ 
        message: 'Booking saved but email failed', 
        emailSent: false,
        bookingId: newBooking._id
      });
    }
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ 
      message: 'Failed to save booking',
      error: err.message 
    });
  }
});

// Admin Endpoints (unchanged)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

app.get('/api/admin/survey-stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    jwt.verify(token, process.env.JWT_SECRET);

    const allResponses = await SurveyResponse.find({});
    
    const stats = {
      totalResponses: allResponses.length,
      questionStats: surveyQuestions.map(q => ({
        questionId: q.id,
        questionText: q.question,
        options: q.options.map(option => ({
          text: option,
          count: allResponses.filter(r => r.answers[q.id] === option).length
        }))
      }))
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get survey stats' });
  }
});

app.get('/api/admin/survey-responses/:questionId/:option', async (req, res) => {
  try {
    const { questionId, option } = req.params;
    const responses = await SurveyResponse.find({
      [`answers.${questionId}`]: option
    });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get responses' });
  }
});

app.get('/api/admin/appointments', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const appointments = await Booking.find({
      $or: [
        { 
          date: { 
            $gt: today.toISOString()
          } 
        },
        { 
          date: today.toISOString(), 
          time: { $gte: new Date().toLocaleTimeString('en-US', { hour12: false }) } 
        }
      ]
    })
    .sort({ date: 1, time: 1 }) 
    .lean();
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server Startup
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize email scheduler after server starts
  initEmailScheduler();
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;