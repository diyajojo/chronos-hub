const { prisma } = require("../utils/prisma");
const bcrypt = require("bcrypt");

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    // Find pending verification
    const pending = await prisma.pendingVerification.findUnique({ where: { email } });

    if (!pending) {
      return res.status(400).json({ error: "No pending verification found" });
    }

    // Check if OTP is correct and not expired
    if (pending.otp !== otp || pending.otpExpiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Create user in User table
    const user = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
      },
    });

    // Delete pending verification
    await prisma.pendingVerification.delete({ where: { email } });

    return res.status(201).json({
      message: "User verified and created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } 
  catch (err) 
  {
    console.error('Verification error:', err);
    return res.status(500).json({ error: "Verification failed" });
  }
}

module.exports = verifyOTP; 