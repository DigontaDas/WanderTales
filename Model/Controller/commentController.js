import storiesModel from '../models/stories.js';

const addComment = async (req, res) => {
    try {
        const { storyId, comment, authorName, authorId } = req.body;
        
        // Verify authentication
        let user;
        try {
            user = await verifyToken(req);
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required to comment" 
            });
        }

        if (!storyId || !comment) {
            return res.status(400).json({ 
                success: false, 
                message: "Story ID and comment are required" 
            });
        }

        // Use authenticated user's info
        const commentData = {
            _id: new mongoose.Types.ObjectId().toString(),
            authorName: user.name,
            authorId: user._id,
            comment: comment.trim(),
            createdAt: new Date(),
            likes: 0
        };

        const story = await storiesModel.findById(storyId);
        if (!story) {
            return res.status(404).json({ 
                success: false, 
                message: "Story not found" 
            });
        }

        story.commentsList.push(commentData);
        story.comments = story.commentsList.length;
        await story.save();

        res.json({ 
            success: true, 
            message: "Comment added successfully",
            totalComments: story.comments
        });
    } catch (error) {
        console.error('Error in addComment:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error adding comment" 
        });
    }
};

// Get comments for a story
const getComments = async (req, res) => {
    try {
        console.log('Get comments request received');
        
        const { storyId } = req.body;
        
        if (!storyId) {
            return res.status(400).json({ 
                success: false, 
                message: "Story ID is required" 
            });
        }

        const story = await storiesModel.findById(storyId);
        
        if (!story) {
            return res.status(404).json({ 
                success: false, 
                message: "Story not found" 
            });
        }

        console.log('Comments found:', story.commentsList?.length || 0);
        
        res.status(200).json({ 
            success: true, 
            comments: story.commentsList || [],
            totalComments: story.comments || 0
        });
    } catch (error) {
        console.error('Error in getComments:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error fetching comments" 
        });
    }
};

// Like a comment
const likeComment = async (req, res) => {
    try {
        console.log('Like comment request received');
        
        const { storyId, commentId } = req.body;
        
        if (!storyId || !commentId) {
            return res.status(400).json({ 
                success: false, 
                message: "Story ID and Comment ID are required" 
            });
        }

        const story = await storiesModel.findById(storyId);
        
        if (!story) {
            return res.status(404).json({ 
                success: false, 
                message: "Story not found" 
            });
        }

        // Find and update comment
        const comment = story.commentsList?.find(c => c._id === commentId);
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                message: "Comment not found" 
            });
        }

        comment.likes = (comment.likes || 0) + 1;
        await story.save();
        
        console.log('Comment liked successfully. New likes count:', comment.likes);
        
        res.status(200).json({ 
            success: true, 
            message: "Comment liked", 
            likes: comment.likes 
        });
    } catch (error) {
        console.error('Error in likeComment:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error liking comment" 
        });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        console.log('Delete comment request received');
        
        const { storyId, commentId } = req.body;
        
        if (!storyId || !commentId) {
            return res.status(400).json({ 
                success: false, 
                message: "Story ID and Comment ID are required" 
            });
        }

        const story = await storiesModel.findById(storyId);
        
        if (!story) {
            return res.status(404).json({ 
                success: false, 
                message: "Story not found" 
            });
        }

        // Remove comment from array
        if (story.commentsList) {
            story.commentsList = story.commentsList.filter(c => c._id !== commentId);
            story.comments = story.commentsList.length;
            await story.save();
        }
        
        console.log('Comment deleted successfully:', commentId);
        
        res.status(200).json({ 
            success: true, 
            message: "Comment deleted",
            totalComments: story.comments
        });
    } catch (error) {
        console.error('Error in deleteComment:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error deleting comment" 
        });
    }
};

export { addComment, getComments, likeComment, deleteComment };