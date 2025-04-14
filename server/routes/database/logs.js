const prisma = require('../../utils/prisma');

const addLog = async (req, res) => {
  try {
    const { year, description, survivalChance, imageUrl, rating, userId } = req.body;

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

    const travelLog = await prisma.TravelLog.create({
      data: {
        yearVisited: parseInt(year),
        story: description,
        survivalChances: parseFloat(survivalChance),
        image: imageUrl || null,
        userId: parseInt(userId)
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

    const userLogs = await prisma.travelLog.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const otherLogs = await prisma.travelLog.findMany({
      where: {
        NOT: {
          userId: parseInt(userId)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ userLogs, otherLogs });
  } 
  catch (error) {
    console.error('Error fetching user logs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addLog, fetchUserLogs };
