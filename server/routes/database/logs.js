const { prisma } = require('../../utils/prisma');

const addLog = async (req, res) => {
  try {
    const { year, description, survivalChance, imageUrl, userId } = req.body;

    if (!year || !description || !survivalChance || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    if (isNaN(year) || isNaN(survivalChance) || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid numeric values provided' 
      });
    }

    const travelLog = await prisma.travelLog.create({
      data: {
        yearVisited: parseInt(year),
        story: description,
        survivalChances: parseInt(survivalChance),
        image: imageUrl || '',  // Changed from null to empty string to match schema
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

    res.status(201).json({ success: true, travelLog });
  }
  catch (error) {
    console.error('Error creating travel log:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID provided' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create travel log',
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
