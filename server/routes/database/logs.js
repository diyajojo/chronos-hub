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

    // Add validation for year value to ensure it's within INT limits
    const yearValue = parseInt(year);
    const MIN_SAFE_INT = -2147483648; // Minimum safe INT value
    const MAX_SAFE_INT = 2147483647;  // Maximum safe INT value
    
    if (yearValue < MIN_SAFE_INT || yearValue > MAX_SAFE_INT) {
      return res.status(400).json({
        success: false,
        error: `Year value out of range. Please use a year between ${MIN_SAFE_INT} and ${MAX_SAFE_INT}`
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
        yearVisited: yearValue,
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
    let earnedBadges = [];
    let chronodopplerInfo = null;
    
    // Check for Chronodoppler badge - same year as other users
    try {
      // First check if user already has this badge
      const existingDopplerBadge = await prisma.userBadge.findFirst({
        where: {
          userId: parseInt(userId),
          badgeName: "chronodoppler"
        }
      });
      
      if (!existingDopplerBadge) {
        // Find other users who have logs in the same year
        const sameYearLogs = await prisma.travelLog.findMany({
          where: {
            yearVisited: yearValue,
            userId: {
              not: parseInt(userId)
            }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          take: 5 // Limit to 3 users for display purposes
        });
        
        if (sameYearLogs.length > 0) {
          // Award Chronodoppler badge
          await prisma.userBadge.create({
            data: {
              userId: parseInt(userId),
              badgeName: "chronodoppler"
            }
          });
          
          earnedBadges.push("chronodoppler");
          badgeName = earnedBadges.length === 1 ? "chronodoppler" : badgeName;
          
          // Collect user names who traveled to the same year
          chronodopplerInfo = {
            year: yearValue,
            travelers: sameYearLogs.map(log => ({
              name: log.user.name,
              userId: log.user.id
            }))
          };
          
          console.log(`Chronodoppler badge awarded to user ${userId} for year ${yearValue} collision`);
        }
      }
    } catch (dopplerError) {
      console.error("Error checking for Chronodoppler badge:", dopplerError);
      // Continue even if this check fails - don't stop other badges
    }
    
    // For first log, add chronosprout badge
    if (isFirstLog) {
      try {
        await prisma.userBadge.create({
          data: {
            userId: parseInt(userId),
            badgeName: "chronosprout"
          }
        });
        earnedBadges.push("chronosprout");
        
        // Check if it's also exactly 100 words
        if (countWords(description) === 100) {
          try {
            // Award Chronoblink badge
            await prisma.userBadge.create({
              data: {
                userId: parseInt(userId),
                badgeName: "chronoblink"
              }
            });
            earnedBadges.push("chronoblink");
          } catch (specialBadgeError) {
            console.error("Error creating chronoblink badge:", specialBadgeError);
          }
        }
        
        badgeName = earnedBadges.length === 1 ? earnedBadges[0] : earnedBadges[0];
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
          earnedBadges.push("chronoblink");
          console.log(`Chronoblink badge awarded to user ${userId} for a 100-word story`);
        }
      } catch (error) {
        console.error("Error creating chronoblink badge:", error);
      }
    }

    // Check for midnight login (12am - 1am)
    const currentHour = new Date().getHours();
    if (currentHour === 0) {
      try {
        // Check if user already has the ChronoExplorer badge
        const existingBadge = await prisma.userBadge.findFirst({
          where: {
            userId: parseInt(userId),
            badgeName: 'chronoexplorer'
          }
        });

        if (!existingBadge) {
          // Award the badge
          await prisma.userBadge.create({
            data: {
              userId: parseInt(userId),
              badgeName: 'chronoexplorer',
              earnedAt: new Date()
            }
          });
          earnedBadges.push("chronoexplorer");
          console.log('Midnight explorer badge awarded to user', userId);
        }
      } catch (badgeError) {
        console.error('Error handling chronoexplorer badge:', badgeError);
      }
    }

    // Award chronoprodigy badge if multiple badges were earned at once
    if (earnedBadges.length > 1) {
      try {
        // Check if user already has this badge
        const existingProdigyBadge = await prisma.userBadge.findFirst({
          where: {
            userId: parseInt(userId),
            badgeName: "chronoprodigy"
          }
        });
        
        if (!existingProdigyBadge) {
          await prisma.userBadge.create({
            data: {
              userId: parseInt(userId),
              badgeName: "chronoprodigy"
            }
          });
          console.log(`Chronoprodigy badge awarded to user ${userId} for earning multiple badges at once: ${earnedBadges.join(', ')}`);
          // Set the primary badge to display as chronoprodigy
          badgeName = "chronoprodigy";
        }
      } catch (prodigyError) {
        console.error("Error creating chronoprodigy badge:", prodigyError);
      }
    }

    return res.status(201).json({ 
      success: true, 
      travelLog,
      badgeName,
      earnedBadges,
      chronodopplerInfo  // Include collision info in the response
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
    const { userId, page = 1, limit = 25 } = req.body;
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID provided' 
      });
    }

    const parsedUserId = parseInt(userId);
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Get total counts for pagination
    const [userLogsCount, otherLogsCount] = await Promise.all([
      prisma.travelLog.count({
        where: { userId: parsedUserId }
      }),
      prisma.travelLog.count({
        where: { userId: { not: parsedUserId } }
      })
    ]);

    const [userLogs, otherLogs] = await Promise.all([
      prisma.travelLog.findMany({
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
        },
        skip,
        take: parsedLimit
      }),
      prisma.travelLog.findMany({
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
        },
        skip,
        take: parsedLimit
      })
    ]);

    return res.status(200).json({ 
      success: true,
      userLogs: userLogs || [], 
      otherLogs: otherLogs || [],
      pagination: {
        userLogs: {
          total: userLogsCount,
          pages: Math.ceil(userLogsCount / parsedLimit),
          currentPage: parsedPage,
          limit: parsedLimit
        },
        otherLogs: {
          total: otherLogsCount,
          pages: Math.ceil(otherLogsCount / parsedLimit),
          currentPage: parsedPage,
          limit: parsedLimit
        }
      }
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