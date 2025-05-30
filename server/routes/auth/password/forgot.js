const { prisma } = require("../../../utils/prisma");
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../../../services/emailservice');

// In-memory store for reset tokens: { token: { userId, expires } }
const resetTokens = {};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) 
    return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) 
      return res.status(200).json({ success: true }); // Don't reveal if user exists

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 15; // 15 minutes
    resetTokens[token] = { userId: user.id, expires };

    // Send email using the centralized service
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

module.exports = { forgotPassword, resetTokens }; 