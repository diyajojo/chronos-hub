// server/routes/auth/signup.js
const { prisma } = require("../../utils/prisma");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../../services/emailservice");

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists in User or PendingVerification
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingPending = await prisma.pendingVerification.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    if (existingPending) {
      return res.status(400).json({ error: "Email verification pending" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Store in PendingVerification
      await prisma.pendingVerification.create({
        data: {
          name,
          email,
          password: hashedPassword,
          otp,
          otpExpiry,
        },
      });

      // Send OTP email
      await sendOTPEmail(email, otp);

      return res.status(201).json({ message: "OTP sent to your email" });
    } 
    catch (emailError) 
    {
      // If email sending fails, delete the pending verification
      await prisma.pendingVerification.delete({ where: { email } });
      return res.status(400).json({ error: "Failed to send OTP. Please try again later." });
    }
  } catch (err) {
    return res.status(500).json({ error: "User could not be created" });
  }
}

module.exports = signup;

//hash password
    //bcrypt is a hashing algorithm
    //the second parameter is the number of rounds to hash the password
    //the higher the number, the more secure but also slower it is
    //10 is a good default