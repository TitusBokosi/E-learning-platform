const { resend } = require('../services/emailService');
const prisma = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const submitFeedback = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // 1. Save to database
  const feedback = await prisma.feedback.create({
    data: {
      name,
      email,
      subject,
      message,
    },
  });

  // 2. Send email via Resend
  try {
    await resend.emails.send({
      from: 'Titsate Support <onboarding@resend.dev>', // Update this when domain is verified
      to: process.env.FEEDBACK_RECEIVER_EMAIL , // Set this in your .env
      subject: `[Feedback] ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8D21FF;">New Feedback Received</h2>
          <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This feedback was submitted via the Titsate contact form.
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Email delivery failed:', emailError);
    // We don't fail the request if email fails but DB succeeded
  }

  res.status(200).json({
    status: 'success',
    message: 'Feedback sent successfully',
    data: feedback
  });
});

module.exports = { submitFeedback };
