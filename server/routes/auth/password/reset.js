const  { prisma } = require("../../../utils/prisma");
const bcrypt = require('bcryptjs');
const { resetTokens } = require('./forgot');

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password are required' });

  const tokenData = resetTokens[token];
  if (!tokenData || tokenData.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: tokenData.userId },
      data: { password: hashedPassword },
    });
    // Remove token after use
    delete resetTokens[token];
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { resetPassword }; 