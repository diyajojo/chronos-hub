const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addComment(req, res) {
  try {
    const { travelLogId, text, commenter } = req.body;
    const now = new Date();
    
    const newComment = await prisma.comment.create({
      data: {
        travelLogId,
        text,
        commenter,
        time: now
      },
    });

    res.json({
      id: newComment.id,
      text: newComment.text,
      commenter: newComment.commenter,
      time: newComment.time
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
}

module.exports = addComment;
