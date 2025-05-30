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

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build where clause based on search term
    const whereClause = search ? {
      name: {
        contains: search,
        mode: 'insensitive'
      }
    } : {};

    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: whereClause
    });

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      },
      skip,
      take: parsedLimit
    });

    return res.status(200).json({ 
      success: true,
      users: users || [],
      pagination: {
        total: totalUsers,
        pages: Math.ceil(totalUsers / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit
      }
    });
  } 
  catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users',
      details: error.message 
    });
  }
};

module.exports = { searchUsers, getAllUsers };