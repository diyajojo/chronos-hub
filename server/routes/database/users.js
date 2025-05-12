const { prisma } = require('../../utils/prisma');

const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    
    // Require a search term with at least 2 characters
    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(200).json({ 
        success: true, 
        users: [] 
      });
    }

    // Find users with names containing the search term (case insensitive)
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
      },
      take: 10 // Limit results to prevent overwhelming response
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