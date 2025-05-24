const  { prisma } = require("../../../utils/prisma");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory store for reset tokens: { token: { userId, expires } }
const resetTokens = {};

// Configure nodemailer (use your real email credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ success: true }); // Don't reveal if user exists

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 15; // 15 minutes
    resetTokens[token] = { userId: user.id, expires };

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { forgotPassword, resetTokens }; 