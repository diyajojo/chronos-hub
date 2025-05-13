const { prisma } = require('../../utils/prisma');

const getUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Enhanced validation
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Invalid user ID format - must be a positive integer' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });

      if (!user) {
        console.log(`User not found for ID: ${userId}`);
        return res.status(404).json({ error: 'User not found' });
      }

      // Convert createdAt to ISO string if it exists becuase JSON.stringify() of timestamp  doesn't work with Date objects
      const userData = {
        ...user,
        createdAt: user.createdAt ? user.createdAt.toISOString() : undefined
      };

      return res.json({ user: userData });
    } 
    catch (prismaError) 
    {
      console.error('Prisma error in getUser:', prismaError);
      return res.status(500).json({ error: 'Database error', details: prismaError.message });
    }
  } 
  catch (error) 
  {
    console.error('Unexpected error in getUser route:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = { getUser };
