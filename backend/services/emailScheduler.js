const cron = require('node-cron');
const SurveyResponse = require('../models/SurveyResponse');
const { sendSurveySequenceEmail } = require('./emailService');

// Initialize the email scheduler
const initEmailScheduler = () => {
  // Run every hour to check for due emails
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running email scheduler at', new Date());
      
      // Get all survey responses with pending emails
      const responses = await SurveyResponse.find({
        'emailSchedule': {
          $elemMatch: {
            sent: false,
            scheduledAt: { $lte: new Date() }
          }
        }
      });

      // Process each pending email
      for (const response of responses) {
        for (const emailItem of response.emailSchedule) {
          if (!emailItem.sent && emailItem.scheduledAt <= new Date()) {
            try {
              // Send the appropriate email
              await sendSurveySequenceEmail(
                response.email, 
                response.name, 
                emailItem.day
              );
              
              // Update the record
              emailItem.sent = true;
              emailItem.sentAt = new Date();
              await response.save();
              
              console.log(`Sent day ${emailItem.day} email to ${response.email}`);
            } catch (err) {
              console.error(`Failed to send day ${emailItem.day} email:`, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Email scheduler error:', err);
    }
  });
};

module.exports = initEmailScheduler;