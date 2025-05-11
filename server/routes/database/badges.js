const { prisma } = require('../../utils/prisma');

const fetchUserBadges = async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log('Fetch user badges request received for userId:', userId);
    
    if (!userId || isNaN(parseInt(userId))) {
      console.error('Invalid userId provided:', userId);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID provided' 
      });
    }

    const parsedUserId = parseInt(userId);
    console.log('Fetching badges for userId:', parsedUserId);

    const userBadges = await prisma.userBadge.findMany({
      where: {
        userId: parsedUserId
      },
      select: {
        badgeName: true,
        earnedAt: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });

    console.log(`Found ${userBadges.length} badges for user ${parsedUserId}:`, userBadges);

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