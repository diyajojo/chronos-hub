const { prisma } = require('../../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!existingUser) {
      console.log("user doesnt exist , go signup");
      return res.status(401).json({ "error": "invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      console.log("invalid password");
      return res.status(401).json({ "error": "invalid credentials" });
    }

    const payLoad = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      createdAt: existingUser.createdAt.toISOString()
    }

    const token = jwt.sign(payLoad, JWT_SECRET, { expiresIn: '1h' });

    // Check for midnight login (12am - 1am)
    const currentHour = new Date().getHours();
    let newBadgeAwarded = false;
    
    console.log(`Current hour is: ${currentHour}`); // Debug current hour

    // Check for midnight (00:00 - 00:59)
    if (currentHour === 0) {
      try {
        // Check if user already has the ChronoExplorer badge
        const existingBadge = await prisma.userBadge.findFirst({
          where: {
            AND: [
              { userId: existingUser.id },
              { badgeName: 'chronoexplorer' }
            ]
          }
        });

        console.log('Existing badge check:', existingBadge ? 'Badge already exists' : 'Badge not found'); // Debug

        if (!existingBadge) {
          // Award the badge
          await prisma.userBadge.create({
            data: {
              userId: existingUser.id,
              badgeName: 'chronoexplorer',
              earnedAt: new Date() // Changed from createdAt to earnedAt to match the UserBadge schema
            }
          });
          newBadgeAwarded = true;
          console.log('Midnight explorer badge awarded successfully');
        }
      } catch (badgeError) {
        console.error('Error handling badge:', badgeError);
        // Continue with login even if badge creation fails
      }
    }

    // Always send the badge status in response
    const response = {
      success: true,
      token: token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt.toISOString()
      },
      newBadge: newBadgeAwarded ? 'chronoexplorer' : null
    };

    console.log('Login response:', response);
    return res.status(200).json(response);
  }
  catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      error: "internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

module.exports = login;