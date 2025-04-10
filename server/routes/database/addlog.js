const prisma = require('../../utils/prisma');

async function addLog(req, res) {
  try {
    const { year, description, survivalChance, imageUrl, rating, userId } = req.body;

    // Validate required fields
    if (!year || !description || !survivalChance || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Validate numeric fields
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
        rating: rating ? parseInt(rating) : 0,
        userId: parseInt(userId)
      }
    });

    res.status(201).json({ success: true, travelLog });
  }
  catch (error) {
    console.error('Error creating travel log:', error);
    // More specific error handling
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
}

module.exports = addLog;
