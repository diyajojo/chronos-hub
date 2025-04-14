const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addReaction = async (req, res) => {
  try {
    const { travelLogId, type, reactor } = req.body;
    
    if (!reactor) {
      return res.status(400).json({ error: 'Reactor is required' });
    }

    // Check if user has any existing reaction
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        travelLogId: Number(travelLogId),
        reactor,
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // If same reaction, remove it
        await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
        return res.json({ message: 'Reaction removed' });
      } else {
        // If different reaction, update it
        const updatedReaction = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return res.json(updatedReaction);
      }
    }

    // Create new reaction
    const reaction = await prisma.reaction.create({
      data: {
        travelLogId: Number(travelLogId),
        type,
        reactor,
      },
    });

    res.json(reaction);
  } catch (error) {
    console.error('Error handling reaction:', error);
    res.status(500).json({ error: 'Failed to handle reaction' });
  }
};

const fetchReactions = async (req, res) => {
  try {
    const { travelLogId } = req.body;
    const reactions = await prisma.reaction.findMany({
      where: {
        travelLogId: Number(travelLogId),
      },
    });

    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      reactions,
      counts: reactionCounts
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
};

module.exports = { addReaction, fetchReactions };
