const prisma = require("../../utils/prisma");

async function fetchUserLogs(req, res) {
  try {
    const { userId } = req.body;

    const logs = await prisma.travelLog.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Error fetching user logs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = fetchUserLogs;
