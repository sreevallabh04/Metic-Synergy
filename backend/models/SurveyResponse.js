const mongoose = require('mongoose');

const EmailScheduleSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  scheduledAt: { type: Date, required: true },
  sent: { type: Boolean, default: false },
  sentAt: { type: Date }
});

const SurveyResponseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  answers: { type: Object, required: true },
  emailSchedule: { type: [EmailScheduleSchema] },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to set up email schedule
SurveyResponseSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    this.emailSchedule = [
      { day: 1, scheduledAt: new Date(now.setDate(now.getDate() + 1)) },
      { day: 2, scheduledAt: new Date(now.setDate(now.getDate() + 1)) },
      { day: 3, scheduledAt: new Date(now.setDate(now.getDate() + 1)) },
      { day: 4, scheduledAt: new Date(now.setDate(now.getDate() + 2)) },
      { day: 6, scheduledAt: new Date(now.setDate(now.getDate() + 2)) },
      { day: 8, scheduledAt: new Date(now.setDate(now.getDate() + 2)) },
      { day: 10, scheduledAt: new Date(now.setDate(now.getDate() + 1)) },
      { day: 11, scheduledAt: new Date(now.setDate(now.getDate() + 1)) }
    ];
  }
  next();
});

module.exports = mongoose.model('SurveyResponse', SurveyResponseSchema);