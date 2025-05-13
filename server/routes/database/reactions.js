const { prisma } = require('../../utils/prisma');

const addReaction = async (req, res) => {
  try {
    const { travelLogId, type, reactor } = req.body;
    
    if (!reactor) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Parse userId and validate
    const userId = Number(reactor);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const travelLogIdNum = Number(travelLogId);

    // Check if user has any existing reaction
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        travelLog: {
          id: travelLogIdNum
        },
        user: {
          id: userId
        }
      },
      include: {
        user: true  // Include user details
      }
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
          include: {
            user: true  // Include user details
          }
        });
        // Add reactor name to response
        const response = {
          ...updatedReaction,
          reactor: updatedReaction.user.name
        };
        return res.json(response);
      }
    }

    // Create new reaction
    const reaction = await prisma.reaction.create({
      data: {
        type,
        user: {
          connect: { id: userId }
        },
        travelLog: {
          connect: { id: travelLogIdNum }
        }
      },
      include: {
        user: true  // Include user details
      }
    });

    // Add reactor name to response
    const response = {
      ...reaction,
      reactor: reaction.user.name
    };

    res.json(response);
  } catch (error) {
    console.error('Error handling reaction:', error);
    res.status(500).json({ error: 'Failed to handle reaction' });
  }
};

const fetchReactions = async (req, res) => {
  try {
    const { travelLogId } = req.body;
    const travelLogIdNum = Number(travelLogId);
    
    const reactions = await prisma.reaction.findMany({
      where: {
        travelLog: {
          id: travelLogIdNum
        }
      },
      include: {
        user: true
      }
    });

    // Add reactor name to each reaction
    const reactionsWithNames = reactions.map(reaction => ({
      ...reaction,
      reactor: reaction.user.name
    }));

    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      reactions: reactionsWithNames,
      counts: reactionCounts
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
};

module.exports = { addReaction, fetchReactions };
