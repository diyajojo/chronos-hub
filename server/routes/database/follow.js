const { prisma } = require('../../utils/prisma');

const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;  // Get follower ID from cookie/token
    const { followingId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    console.log('Follow attempt:', { followerId, followingId }); // Add logging

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: {
        id: parseInt(followingId)
      }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User to follow not found' });
    }

    // Check if already following
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: parseInt(followingId)
        }
      }
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create follow relationship
    const follow = await prisma.follows.create({
      data: {
        followerId: parseInt(followerId),
        followingId: parseInt(followingId)
      }
    });

    res.json({ success: true, follow });
  } catch (error) {
    console.error('Follow error:', error); // Add detailed error logging
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: parseInt(followingId),
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Not following or user not found' });
  }
};

const getFollowersCount = async (req, res) => {
  try {
    
    const { userId } = req.body; // id of the user whose follower count we want 
    const followerId = req.user?.id; // id of the logged-in user , recived from the cookie

    const [count, isFollowing] = await Promise.all([
      // this gets the count of followers , where following is the userId
      prisma.follows.count({
        where: {
          followingId: parseInt(userId),
        },
      }),
      // this checks if the logged-in user is following the profile being viewed user 
      // returns true or false isFollowing
      // needed to show the follow/follwing button conditionally 
      followerId ? prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId: parseInt(userId),
          },
        },
      }) : Promise.resolve(null)
    ]);

    // Double bang (!!) converts to boolean
    // null/undefined -> false
    // existing record -> true
    res.json({ 
      count,
      isFollowing: !!isFollowing
    });
  } catch (error) {
    res.status(400).json({ error: 'Error getting followers count' });
  }
};

// here we just need the count of the users being followed and isFollowing isnt needed here because button doesnt depend on the following count
// so we dont need to check if the logged-in user is following the profile being viewed
const getFollowingCount = async (req, res) => {
  try {
    const { userId } = req.body;
    const count = await prisma.follows.count({
      where: {
        followerId: parseInt(userId),
      },
    });
    res.json({ count });
  } catch (error) {
    res.status(400).json({ error: 'Error getting following count' });
  }
};

const getFollowersList = async (req, res) => {
  try {
    const { userId } = req.body;
    const followers = await prisma.follows.findMany({
      where: {
        followingId: parseInt(userId),
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    res.json({ 
      users: followers.map(f => ({
        id: f.follower.id,
        name: f.follower.name,
      }))
    });
  } catch (error) {
    res.status(400).json({ error: 'Error getting followers list' });
  }
};

const getFollowingList = async (req, res) => {
  try {
    const { userId } = req.body;
    const following = await prisma.follows.findMany({
      where: {
        followerId: parseInt(userId),
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    res.json({ 
      users: following.map(f => ({
        id: f.following.id,
        name: f.following.name,
      }))
    });
  } catch (error) {
    res.status(400).json({ error: 'Error getting following list' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowersCount,
  getFollowingCount,
  getFollowersList,
  getFollowingList,
};
