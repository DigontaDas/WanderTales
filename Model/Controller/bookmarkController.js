import storiesModel from '../models/stories.js';

// Toggle bookmark for a story

const toggleBookmark = async (req, res) => {
    try {
        console.log('Toggle bookmark request received');
        console.log('Request body:', req.body);

        const { storyId } = req.body;

        // Validate required fields
        if (!storyId) {
            return res.status(400).json({ 
                success: false, 
                message: "Story ID is required" 
            });
        }

        // Find the story
        const story = await storiesModel.findById(storyId);
        if (!story) {
            return res.status(404).json({ 
                success: false, 
                message: "Story not found" 
            });
        }

        // Toggle bookmark status
        story.bookmarked = !story.bookmarked;

        await story.save();
        
        console.log('Bookmark toggled successfully. Is bookmarked:', story.bookmarked);
        
        res.status(200).json({ 
            success: true, 
            message: story.bookmarked ? "Story bookmarked" : "Bookmark removed",
            bookmarked: story.bookmarked
        });
        
    } catch (error) {
        console.error('Error in toggleBookmark:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
};

const getBookmarkStatus = async (req, res) => {
    try {
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

        res.status(200).json({ 
            success: true, 
            bookmarked: story.bookmarked || false
        });
        
    } catch (error) {
        console.error('Error in getBookmarkStatus:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
};

export { toggleBookmark, getBookmarkStatus };
