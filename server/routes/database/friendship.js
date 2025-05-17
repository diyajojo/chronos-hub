const { prisma } = require('../../utils/prisma');

const handleSendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ 
        success: false, 
        message: 'Friend request already exists or users are already friends' 
      });
    }

    const friendship = await prisma.friendship.create({
      data: {
        user1Id: senderId,
        user2Id: receiverId,
        status: 'pending'
      }
    });

    return res.status(200).json({ success: true, friendship });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return res.status(500).json({ success: false, error: 'Failed to send friend request' });
  }
};

const handleAcceptRequest = async (req, res) => {
  const { friendshipId } = req.body;
  try {
    const friendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' }
    });
    return res.status(200).json({ success: true, friendship });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({ success: false, error: 'Failed to accept friend request' });
  }
};

const handleRejectRequest = async (req, res) => {
  const { friendshipId } = req.body;
  try {
    await prisma.friendship.delete({
      where: { id: friendshipId }
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return res.status(500).json({ success: false, error: 'Failed to reject friend request' });
  }
};

const handleGetFriendRequests = async (req, res) => {
  const { userId } = req.params;
  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        user2Id: userId,
        status: 'pending'
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return res.status(200).json({ success: true, pendingRequests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch friend requests' });
  }
};

const handleGetFriendshipStatus = async (req, res) => {
  const { user1Id, user2Id } = req.body;
  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: user1Id, user2Id: user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      }
    });
    return res.status(200).json({ 
      success: true, 
      exists: !!friendship,
      status: friendship ? friendship.status : null,
      friendship
    });
  } catch (error) {
    console.error('Error fetching friendship status:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch friendship status' });
  }
};

const handleGetFriends = async (req, res) => {
  const { userId } = req.params;
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        status: 'accepted'
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const friends = friendships.map(friendship => 
      friendship.user1Id === userId ? friendship.user2 : friendship.user1
    );

    return res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch friends' });
  }
};

module.exports = {
  handleSendRequest,
  handleAcceptRequest,
  handleRejectRequest,
  handleGetFriendRequests,
  handleGetFriendshipStatus,
  handleGetFriends
};