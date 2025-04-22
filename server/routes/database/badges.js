const { prisma } = require('../../utils/prisma');

const fetchUserBadges = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID provided' 
      });
    }

    const userBadges = await prisma.userBadge.findMany({
      where: {
        userId: parseInt(userId)
      },
      select: {
        badgeName: true
      }
    });

    return res.status(200).json({ 
      success: true,
      badges: userBadges
    });
  } 
  catch (error) {
    console.error('Error fetching user badges:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch badges',
      details: error.message 
    });
  }
};

module.exports = { fetchUserBadges }; 