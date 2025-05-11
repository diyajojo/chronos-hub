const { prisma } = require('../../utils/prisma');

// Helper function to count words in a string
const countWords = (text) => {
  return text.trim().split(/\s+/).length;
};

const addLog = async (req, res) => {
  try {
    const { year, title, description, imageUrl, userId } = req.body;

    if (!year || !title || !description || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    if (isNaN(year) || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid numeric values provided' 
      });
    }

    // Check if this is user's first log
    const existingLogs = await prisma.travelLog.count({
      where: { userId: parseInt(userId) }
    });

    const isFirstLog = existingLogs === 0;

    // Create the travel log
    const travelLog = await prisma.travelLog.create({
      data: {
        yearVisited: parseInt(year),
        title,
        story: description,
        image: imageUrl || '',
        userId: parseInt(userId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Check for badges
    let badgeName = null;
    
    // For first log, add chronosprout badge
    if (isFirstLog) {
      try {
        await prisma.userBadge.create({
          data: {
            userId: parseInt(userId),
            badgeName: "chronosprout"
          }
        });
        badgeName = "chronosprout";
      } catch (error) {
        console.error("Error creating chronosprout badge:", error);
        // Don't fail the log creation if badge creation fails
      }
    } 
    // Check for exactly 100 words to award chronoblink badge
    else if (countWords(description) === 100) {
      try {
        // First check if user already has this badge
        const existingBadge = await prisma.userBadge.findFirst({
          where: {
            userId: parseInt(userId),
            badgeName: "chronoblink"
          }
        });
        
        if (!existingBadge) {
          await prisma.userBadge.create({
            data: {
              userId: parseInt(userId),
              badgeName: "chronoblink"
            }
          });
          badgeName = "chronoblink";
          console.log(`Chronoblink badge awarded to user ${userId} for a 100-word story`);
        }
      } catch (error) {
        console.error("Error creating chronoblink badge:", error);
      }
    }

    return res.status(201).json({ 
      success: true, 
      travelLog,
      badgeName
    });
  } 
  catch (error) {
    console.error('Error adding log:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to add travel log',
      details: error.message 
    });
  }
};

const fetchUserLogs = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID provided' 
      });
    }

    const parsedUserId = parseInt(userId);

    const userLogs = await prisma.travelLog.findMany({
      where: {
        userId: parsedUserId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const otherLogs = await prisma.travelLog.findMany({
      where: {
        userId: {
          not: parsedUserId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ 
      success: true,
      userLogs: userLogs || [], 
      otherLogs: otherLogs || []
    });
  } 
  catch (error) {
    console.error('Error fetching user logs:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch logs',
      details: error.message 
    });
  }
};

module.exports = { addLog, fetchUserLogs };
