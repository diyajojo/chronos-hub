const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Send friend request
router.post('/send-request', async (req, res) => {
  const { senderId, receiverId } = req.body;
  
  try {
    // Check if friendship already exists
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

    // Create new friendship request
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
});

// Accept friend request
router.post('/accept-request', async (req, res) => {
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
});

// Reject/delete friend request
router.post('/reject-request', async (req, res) => {
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
});

// Get friend requests for a user
router.post('/friend-requests', async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Get pending requests received by the user
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
});

// Get friendship status between two users
router.post('/status', async (req, res) => {
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
});

// Get all friends for a user
router.post('/friends', async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Find all accepted friendships where user is either user1 or user2
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

    // Extract the friend data (the other user in each friendship)
    const friends = friendships.map(friendship => 
      friendship.user1Id === userId ? friendship.user2 : friendship.user1
    );

    return res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch friends' });
  }
});

module.exports = router; 