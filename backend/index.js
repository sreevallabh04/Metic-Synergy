require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Booking = require('./models/Booking'); // Import the Booking model

const app = express();
const PORT = process.env.PORT || 5000;

// Parse CORS_ORIGINS env var (comma-separated list of allowed origins)
const corsOrigins = process.env.CORS_ORIGINS ? 
  process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : 
  ['http://localhost:5173']; // Default to development origin

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(bodyParser.json());

// Use environment variable for MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/metic-synergy';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.post('/api/bookings', async (req, res) => {
  const { name, phone, email, date, time, company, service } = req.body;

  console.log('Received booking data:', { name, phone, email, date, time, company, service });

  const newBooking = new Booking({
    name,
    phone,
    email,
    date,
    time,
    company,
    service,
  });

  try {
    await newBooking.save();
    console.log('Booking saved successfully:', newBooking);
    res.status(201).json({ message: 'Booking saved successfully' });
  } catch (err) {
    console.error('Failed to save booking:', err);
    res.status(500).json({ message: 'Failed to save booking', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);
});