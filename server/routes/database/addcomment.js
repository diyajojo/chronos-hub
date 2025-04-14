const prisma = require('../../utils/prisma');

const addComment = async (req, res) => {
    try {
        const { travelLogId, text, commenter, parentId } = req.body;
        const now = new Date();

        const newComment = await prisma.comment.create({
            data: {
                travelLogId: parseInt(travelLogId), // Convert to integer
                text,
                commenter,
                parentId: parentId || null, // Ensure null if undefined
                time: now
            },
            include: {
                replies: true
            }
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error details:', error); // Add detailed error logging
        res.status(500).json({ error: 'Failed to add comment', details: error.message });
    }
};

module.exports = addComment;
