const  { prisma } = require('../../utils/prisma');

const addComment = async (req, res) => {
    try {
        const { travelLogId, text, commenter, parentId } = req.body;
        const now = new Date();

        const newComment = await prisma.comment.create({
            data: {
                travelLogId: parseInt(travelLogId),
                text,
                commenter,
                parentId: parentId || null,
                time: now
            },
            include: {
                replies: true
            }
        });

        res.status(201).json(newComment);
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
                travelLogId: parseInt(travelLogId),
                parentId: null
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        
        const getCommentWithReplies = async (commentId) => {
            const replies = await prisma.comment.findMany({
                where: {
                    parentId: commentId
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            
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

module.exports = { addComment, fetchComments };
