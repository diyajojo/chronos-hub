const prisma = require('../../utils/prisma');

async function fetchComments(req, res) {
  try {
    const { travelLogId } = req.body;
    
    if (!travelLogId) {
      return res.status(400).json({ error: 'Travel log ID is required' });
    }

    const comments = await prisma.comment.findMany({
      where: {
        travelLogId: parseInt(travelLogId)
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        text: true,
        time: true,
        commenter: true
      }
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

module.exports = fetchComments;
