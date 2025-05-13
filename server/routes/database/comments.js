const  { prisma } = require('../../utils/prisma');

const addComment = async (req, res) => {
    try {
        const { travelLogId, text, commenter, parentId } = req.body;
        const now = new Date();

        // Check if commenter is a valid number
        const userId = parseInt(commenter);
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Prepare data object based on whether it's a reply or not
        let commentData = {
            text,
            time: now,
            travelLog: {
                connect: { id: parseInt(travelLogId) }
            },
            user: {
                connect: { id: userId }
            }
        };

        // If this is a reply to another comment, set up the parent relation
        if (parentId) {
            commentData.parent = {
                connect: { id: parentId }
            };
        }

        const newComment = await prisma.comment.create({
            data: commentData,
            include: {
                replies: true,
                user: true  // Include user details in the response
            }
        });

        // Format the response to include commenter name
        const response = {
            ...newComment,
            commenter: newComment.user.name,  // Add the commenter's name from the user relation
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to add comment', details: error.message });
    }
};

const fetchComments = async (req, res) => {
    try {
        const { travelLogId } = req.body;
        
        const topLevelComments = await prisma.comment.findMany({
            where: {
                travelLog: {
                    id: parseInt(travelLogId)
                },
                parent: null
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                user: true  // Include user information
            }
        });
        
        const getCommentWithReplies = async (commentId) => {
            const replies = await prisma.comment.findMany({
                where: {
                    parent: {
                        id: commentId
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    user: true  // Include user information for replies too
                }
            });
            
            const repliesWithNested = await Promise.all(
                replies.map(async (reply) => {
                    const nestedReplies = await getCommentWithReplies(reply.id);
                    return {
                        ...reply,
                        commenter: reply.user.name,  // Add commenter name
                        replies: nestedReplies
                    };
                })
            );
            
            return repliesWithNested;
        };
        
        const commentsWithReplies = await Promise.all(
            topLevelComments.map(async (comment) => {
                const replies = await getCommentWithReplies(comment.id);
                return {
                    ...comment,
                    commenter: comment.user.name,  // Add commenter name
                    replies
                };
            })
        );
        
        res.json(commentsWithReplies);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

module.exports = { addComment, fetchComments };
