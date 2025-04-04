const nodemailer = require('nodemailer');
const { scheduleJob } = require('node-schedule');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true
});

// Base email template with styling
const baseEmailTemplate = (content, preheaderText = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    .email-container { max-width: 600px; margin: 20px auto; padding: 30px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; }
    .content { color: #34495e; line-height: 1.6; font-size: 16px; }
    .cta-button { 
      display: inline-block; 
      background: #3498db; 
      color: #ffffff !important; 
      padding: 12px 30px; 
      border-radius: 5px; 
      text-decoration: none; 
      margin: 25px 0; 
      font-weight: bold;
    }
    .footer { margin-top: 40px; color: #7f8c8d; font-size: 14px; border-top: 1px solid #ecf0f1; padding-top: 20px; }
    .highlight { color: #e74c3c; font-weight: bold; }
    .testimonial { background: #f8f9fa; padding: 20px; border-left: 4px solid #3498db; margin: 25px 0; }
    .urgent { color: #c0392b; font-weight: bold; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>MeticSynergy</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} MeticSynergy. All rights reserved.</p>
      <p><a href="${process.env.UNSUBSCRIBE_LINK}" style="color: #7f8c8d;">Unsubscribe</a> | 
      <a href="${process.env.PRIVACY_LINK}" style="color: #7f8c8d;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
`;

// 1. Booking Confirmation Email
const sendThankYouEmail = async (email, name, date, time, service) => {
  const mailOptions = {
    from: `"MeticSynergy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank You for Booking Your Appointment',
    text: `Dear ${name},\n\nThank you for booking with us. We've received your details for ${service} on ${date} at ${time}.\n\nWe'll confirm your appointment shortly.\n\nBest,\nMeticSynergy Team`,
    html: baseEmailTemplate(`
      <h2>Appointment Confirmed</h2>
      <p>Dear ${name},</p>
      <p>Thank you for choosing MeticSynergy! We've received your booking details:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 25px 0;">
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      </div>
      <p>Our team will contact you within 24 hours to confirm your appointment.</p>
      <p>Best regards,<br/>The MeticSynergy Team</p>
    `)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation sent to ${email}`);
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }
};

// Survey Email Templates
const surveyEmailTemplates = {
  1: (name) => ({
    subject: 'Your Next Step to Growth',
    text: `Hey ${name},\n\nThanks for watching our video! Ready to take action?\n\nChoose:\n🚀 Go solo (with risks)\n🔥 Partner with us (proven system)\n\nBook your free strategy call: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2>Thanks for Watching – Let's Take Action</h2>
      <p>Hey ${name},</p>
      <p>Your interest in our video shows you're serious about growth. Now, choose your path:</p>
      
      <div style="margin: 30px 0;">
        <div style="border: 2px solid #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #e74c3c;">🚀 Go It Alone</h3>
          <ul>
            <li>Trial-and-error approach</li>
            <li>Potential wasted budget</li>
            <li>Missed opportunities</li>
          </ul>
        </div>
        
        <div style="border: 2px solid #3498db; padding: 20px; border-radius: 5px;">
          <h3 style="color: #3498db;">🔥 Partner with MeticSynergy</h3>
          <ul>
            <li>Proven ROI system</li>
            <li>Expert guidance</li>
            <li>Guaranteed results</li>
          </ul>
        </div>
      </div>

      <a href="${process.env.BOOKING_URL}" class="cta-button">Claim Your Free Strategy Session →</a>
    `)
  }),

  2: (name) => ({
    subject: 'Breaking Through Your Growth Barriers',
    text: `Hey ${name},\n\nStruggling with:\n- Low ROI?\n- Inconsistent leads?\n- Marketing overwhelm?\n\nLet's solve this: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2>Breaking Through Growth Barriers</h2>
      <p>Hey ${name},</p>
      <p>We understand the challenges you might be facing:</p>
      
      <div class="testimonial">
        <h3 style="margin-top: 0;">Common Pain Points:</h3>
        <ul>
          <li>📉 Marketing efforts not converting</li>
          <li>🤯 Too many strategies, too little time</li>
          <li>💸 Wasted ad spend with poor ROI</li>
        </ul>
      </div>

      <p>Our clients typically see:</p>
      <div style="background: #27ae60; color: white; padding: 20px; border-radius: 5px;">
        <p>✅ 2-3x ROI within 90 days</p>
        <p>✅ 50%+ increase in qualified leads</p>
        <p>✅ 30% reduction in customer acquisition cost</p>
      </div>

      <a href="${process.env.BOOKING_URL}" class="cta-button">Solve Your Challenges Now →</a>
    `)
  }),

  3: (name) => ({
    subject: 'Urgent: Final Spots Available This Month',
    text: `Hey ${name},\n\nOnly 3 spots left for new clients this month!\n\nSecure your spot: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2 style="color: #c0392b;">⏳ Final Spots Available</h2>
      <p>Hey ${name},</p>
      
      <div style="background: #f8d7da; padding: 20px; border-radius: 5px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #721c24;">Only 3 Client Spots Remaining</h3>
        <p>To maintain our high success rate, we only accept a limited number of clients each month.</p>
      </div>

      <p>When you claim your spot, you'll get:</p>
      <ul>
        <li>📈 Custom Growth Blueprint (value $2,497)</li>
        <li>🎯 First 90-Day Implementation Plan</li>
        <li>🤝 Dedicated Success Manager</li>
      </ul>

      <a href="${process.env.BOOKING_URL}" class="cta-button" style="background: #c0392b;">Claim Your Spot →</a>
    `)
  }),

  4: (name) => ({
    subject: 'Real Results from Businesses Like Yours',
    text: `Hey ${name},\n\nSee how we helped:\n- Client A: 2x ROI in 90 days\n- Client B: 300% lead increase\n\nBook call: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2>Proven Results, Real Growth</h2>
      <p>Hey ${name},</p>
      <p>Don't just take our word for it. See what our clients say:</p>

      <div class="testimonial">
        <h3 style="margin-top: 0;">🏆 Case Study: E-Commerce Brand</h3>
        <p>"MeticSynergy transformed our marketing. In 6 months:</p>
        <ul>
          <li>📈 220% revenue increase</li>
          <li>📉 35% lower CAC</li>
          <li>🎯 90% more qualified leads</li>
        </ul>
      </div>

      <div class="testimonial">
        <h3>🏆 Case Study: SaaS Startup</h3>
        <p>"Their system helped us:</p>
        <ul>
          <li>🚀 3x free trial conversions</li>
          <li>💰 150% ARR growth</li>
          <li>⏱️ Saved 20hrs/week on marketing"</li>
        </ul>
      </div>

      <a href="${process.env.BOOKING_URL}" class="cta-button">Start Your Success Story →</a>
    `)
  }),

  5: (name) => ({
    subject: 'The Growth-Killing Mistake You Might Be Making',
    text: `Hey ${name},\n\nThe #1 mistake? No system!\n\nCommon excuses:\n❌ "I'll figure it out"\n❌ "Not enough time"\n❌ "Too expensive"\n\nFix it now: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2 style="color: #c0392b;">The Silent Growth Killer</h2>
      <p>Hey ${name},</p>
      <p>The #1 mistake we see? No <span class="highlight">systematic approach</span> to growth.</p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 25px 0;">
        <h3>Common (Costly) Excuses:</h3>
        <ul>
          <li>❌ "We'll figure it out as we go"</li>
          <li>❌ "Don't have time to systemize"</li>
          <li>❌ "Can't afford proper marketing"</li>
        </ul>
      </div>

      <p>Our solution:</p>
      <div style="border: 2px solid #3498db; padding: 20px; border-radius: 5px;">
        <h3 style="color: #3498db; margin-top: 0;">The MeticSynergy System</h3>
        <ul>
          <li>✅ Predictable lead generation</li>
          <li>✅ Automated nurturing sequences</li>
          <li>✅ ROI-focused campaigns</li>
        </ul>
      </div>

      <a href="${process.env.BOOKING_URL}" class="cta-button">Eliminate Growth Barriers →</a>
    `)
  }),

  6: (name) => ({
    subject: 'Final 24 Hours to Join Current Cohort',
    text: `Hey ${name},\n\nEnrollment closes in 24 hours!\n\nLast chance: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2 style="color: #c0392b;">⏰ Final Enrollment Window</h2>
      <p>Hey ${name},</p>
      
      <div style="background: #f8d7da; padding: 20px; border-radius: 5px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #721c24;">Enrollment Closes in 24 Hours</h3>
        <p>This is your absolute last chance to join our current implementation group.</p>
      </div>

      <p>What you'll miss if you don't act:</p>
      <ul>
        <li>📅 Priority onboarding</li>
        <li>🎁 Bonus training modules ($1,497 value)</li>
        <li>👥 Private mastermind access</li>
      </ul>

      <a href="${process.env.BOOKING_URL}" class="cta-button" style="background: #c0392b;">Enroll Now →</a>
    `)
  }),

  7: (name) => ({
    subject: 'What’s Holding You Back?',
    text: `Hey ${name},\n\nLet's address your concerns:\n- Budget?\n- Fit?\n- Timing?\n\nNo-pressure chat: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2>Let's Address Your Concerns</h2>
      <p>Hey ${name},</p>
      <p>We understand hesitation. Let's clear the air:</p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 25px 0;">
        <h3 style="margin-top: 0;">Common Concerns We Address:</h3>
        <ul>
          <li>💵 "Is this within our budget?"</li>
          <li>🎯 "Will it work for our industry?"</li>
          <li>⏱️ "Do we have time to implement?"</li>
        </ul>
      </div>

      <p>Our promise:</p>
      <ul>
        <li>🔍 Transparent pricing</li>
        <li>📊 Customized solutions</li>
        <li>🤝 Full implementation support</li>
      </ul>

      <a href="${process.env.BOOKING_URL}" class="cta-button">Get Honest Answers →</a>
    `)
  }),

  8: (name) => ({
    subject: 'Last Chance: Enrollment Closing Permanently',
    text: `Hey ${name},\n\nThis is it! Enrollment closes in 12 hours.\n\nFinal opportunity: ${process.env.BOOKING_URL}\n\nBest,\nMeticSynergy`,
    html: baseEmailTemplate(`
      <h2 style="color: #c0392b;">⚠️ Final Opportunity Alert</h2>
      <p>Hey ${name},</p>
      
      <div style="background: #f8d7da; padding: 20px; border-radius: 5px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #721c24;">Enrollment Closes in 12 Hours</h3>
        <p>After this deadline, we won't accept new clients for 60 days.</p>
      </div>

      <p>Last chance benefits:</p>
      <div style="border: 2px solid #3498db; padding: 20px; border-radius: 5px;">
        <ul>
          <li>💰 Lock in current pricing</li>
          <li>🎁 Free automation setup ($2,000 value)</li>
          <li>👨💻 Priority support access</li>
        </ul>
      </div>

      <a href="${process.env.BOOKING_URL}" class="cta-button" style="background: #c0392b;">Enroll Now →</a>
    `)
  })
};

// Email sequence scheduler
const initiateSurveyEmailSequence = async (email, name) => {
  try {
    // Send initial confirmation
    await transporter.sendMail({
      from: `"MeticSynergy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Completing Our Survey',
      text: `Hi ${name},\n\nThank you for your survey responses. Watch your inbox for valuable insights over the next 11 days.\n\nBest,\nMeticSynergy`,
      html: baseEmailTemplate(`
        <h2>Thank You, ${name}!</h2>
        <p>We appreciate you taking our survey. Over the next 11 days, you'll receive:</p>
        <ul>
          <li>📬 8 strategic emails</li>
          <li>📈 Actionable growth insights</li>
          <li>🎁 Exclusive offers</li>
        </ul>
        <p>First email arrives in 24 hours!</p>
      `)
    });

    // Schedule emails for days 1,2,3,4,6,8,10,11
    const scheduleDays = [1, 2, 3, 4, 6, 8, 10, 11];
    const baseDate = new Date();

    scheduleDays.forEach((dayOffset, index) => {
      const sendDate = new Date(baseDate);
      sendDate.setDate(baseDate.getDate() + dayOffset);
      sendDate.setHours(10, 0, 0, 0); // Send at 10 AM local time

      scheduleJob(sendDate, async () => {
        try {
          const emailNumber = index + 1;
          const template = surveyEmailTemplates[emailNumber](name);
          
          await transporter.sendMail({
            from: `"MeticSynergy" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html,
            headers: {
              'X-Email-Type': `survey-day-${emailNumber}`,
              'X-Sequence-Day': dayOffset.toString()
            }
          });
          console.log(`Sent day ${dayOffset} email to ${email}`);
        } catch (error) {
          console.error(`Failed to send day ${dayOffset} email:`, error);
        }
      });
    });

    console.log(`Scheduled all emails for ${email}`);
  } catch (error) {
    console.error('Error initiating survey sequence:', error);
    throw error;
  }
};

module.exports = {
  sendThankYouEmail,
  initiateSurveyEmailSequence
};