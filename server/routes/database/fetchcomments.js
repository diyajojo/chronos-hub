const prisma = require('../../utils/prisma');

const fetchComments = async (req, res) => {
    try {
        const { travelLogId } = req.body;
        
        // Get top-level comments
        const topLevelComments = await prisma.comment.findMany({
            where: {
                travelLogId: parseInt(travelLogId),
                parentId: null // Only fetch top-level comments
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        
        // Function to recursively fetch replies for a comment
        const getCommentWithReplies = async (commentId) => {
            const replies = await prisma.comment.findMany({
                where: {
                    parentId: commentId
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            
            // Recursively get replies for each reply
            const repliesWithNested = await Promise.all(
                replies.map(async (reply) => {
                    const nestedReplies = await getCommentWithReplies(reply.id);
                    return {
                        ...reply,
                        replies: nestedReplies
                    };
                })
            );
            
            return repliesWithNested;
        };
        
        // Build the complete comment tree
        const commentsWithReplies = await Promise.all(
            topLevelComments.map(async (comment) => {
                const replies = await getCommentWithReplies(comment.id);
                return {
                    ...comment,
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

module.exports = fetchComments;