const { prisma } = require('../../utils/prisma');

const searchUsers = async (req, res) => {
  const { searchTerm } = req.body;

  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(200).json({ 
      success: true,
      users: []
    });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({ 
      success: true,
      users: users || []
    });
  } 
  catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to search users',
      details: error.message 
    });
  }
};

module.exports = { searchUsers };