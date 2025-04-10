const prisma = require('../../utils/prisma');

async function addLog(req, res) 
{
  try {
    const { year, description, survivalChance, imageUrl, rating, userId } = req.body;

    const travelLog = await prisma.TravelLog.create({
      data: {
        yearVisited: parseInt(year), // Convert year to integer
        story: description, // Map description to story field
        survivalChances: survivalChance, // Map survivalChance to survivalChances
        image: imageUrl || '', // Map imageUrl to image, provide default empty string
        rating,
        userId: parseInt(userId) // Convert userId to integer
      }
    });

    res.status(201).json({ success: true, travelLog });
  }
  catch (error) 
  {
    console.error('Error creating travel log:', error);
    res.status(500).json({ success: false, error: 'Failed to create travel log' });
  }
}

module.exports = addLog;
