import {v2 as cloudinary} from 'cloudinary'
import storiesModel from '../models/stories.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';

const verifyToken = async (req) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.body.token;
        if (!token) {
            throw new Error('No token provided');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
const addStory = async (req, res) => {
    try {
        console.log('Add story request received');
        const { title, location, readTime, content, token } = req.body;

        // Verify user authentication
        let user;
        try {
            user = await verifyToken(req);
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required. Please login to post a story." 
            });
        }

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
                    folder: "travel_stories"
                });
                imageUrl = result.secure_url;
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
            content: content.trim(),
            // ADD THIS AUTHOR DATA:
            author: {
                userId: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        };

        const story = new storiesModel(storyData);
        await story.save();
        
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
