require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendThankYouEmail } = require('./services/emailService'); // Import the email service
const Booking = require('./models/Booking'); // Import the Booking model

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || '*'; // Allow all origins if FRONTEND_URL is not set

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || FRONTEND_URL === '*' || FRONTEND_URL.split(',').includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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
      // First save the booking
      await newBooking.save();
      console.log('Booking saved successfully:', newBooking);

      try {
        // Then attempt to send the email
        await sendThankYouEmail(email, name, date, time, service);
        // If email sending succeeds, return success with emailSent flag
        res.status(201).json({ 
          message: 'Booking saved successfully', 
          emailSent: true 
        });
      } catch (emailErr) {
        // If email sending fails but booking was saved, return partial success
        console.error('Failed to send email:', emailErr);
        res.status(201).json({ 
          message: 'Booking saved successfully, but failed to send confirmation email', 
          emailSent: false,
          emailError: emailErr.message 
        });
      }
    } catch (err) {
      // If booking fails to save
      console.error('Failed to save booking:', err);
      res.status(500).json({ 
        message: 'Failed to save booking', 
        error: err.message,
        emailSent: false
      });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export app for Vercel deployment
module.exports = app;