import {v2 as cloudinary} from 'cloudinary'
import storiesModel from '../models/stories.js';

const addStory = async (req, res) => {
    try {
        console.log('Add story request received');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const { title, location, readTime, content } = req.body;

        // Validate required fields
        if (!title || !location || !readTime || !content) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required: title, location, readTime, content" 
            });
        }

        const image = req.files && req.files.image && req.files.image[0];
        let imageUrl = '';

        if (image) {
            try {
                const result = await cloudinary.uploader.upload(image.path, { 
                    resource_type: "image",
                    folder: "travel_stories" // Optional: organize images in folders
                });
                imageUrl = result.secure_url;
                console.log('Image uploaded successfully:', imageUrl);
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error uploading image" 
                });
            }
        }

        const storyData = {
            title: title.trim(),
            location: location.trim(),
            readTime: readTime.trim(),
            image: imageUrl,
            comments: 0,
            likes: 0,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            content: content.trim()
        };

        console.log('Creating story with data:', storyData);

        const story = new storiesModel(storyData);
        await story.save();
        
        console.log('Story saved successfully:', story._id);
        
        res.status(201).json({ 
            success: true, 
            message: "Story added successfully",
            story: story 
        });
        
    } catch (error) {
        console.error('Error in addStory:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
};

const listStories = async (req, res) => {
    try {
        console.log('List stories request received');
        
        const stories = await storiesModel.find({}).sort({ _id: -1 });
        
        console.log(`Found ${stories.length} stories`);
        
        res.status(200).json({ 
            success: true, 
            stories: stories || [] 
        });
    } catch (error) {
        console.error('Error in listStories:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error fetching stories" 
        });
    }
};

const getSingleStory = async (req, res) => {
    try {
        console.log('Get single story request received');
        
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

        console.log('Story found:', story._id);
        
        res.status(200).json({ 
            success: true, 
            story: story 
        });
    } catch (error) {
        console.error('Error in getSingleStory:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error fetching story" 
        });
    }
};

const likeStory = async (req, res) => {
    try {
        console.log('Like story request received');
        
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

        story.likes = (story.likes || 0) + 1;
        await story.save();
        
        console.log('Story liked successfully. New likes count:', story.likes);
        
        res.status(200).json({ 
            success: true, 
            message: "Story liked", 
            likes: story.likes 
        });
    } catch (error) {
        console.error('Error in likeStory:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error liking story" 
        });
    }
};

const removeStory = async (req, res) => {
    try {
        console.log('Remove story request received');
        
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Story ID is required" 
            });
        }

        const deletedStory = await storiesModel.findByIdAndDelete(id);
        
        if (!deletedStory) {
            return res.status(404).json({ 
                success: false, 
                message: "Story not found" 
            });
        }

        console.log('Story removed successfully:', id);
        
        res.status(200).json({ 
            success: true, 
            message: "Story removed" 
        });
    } catch (error) {
        console.error('Error in removeStory:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Error removing story" 
        });
    }
};

export { addStory, listStories, getSingleStory, likeStory, removeStory}