import storiesModel from '../models/stories.js';
import userModel from '../models/usermodel.js';
import destinationModel from '../models/destinationModel.js';

// Get community stats
const getCommunityStats = async (req, res) => {
    try {
        console.log('Getting community stats...');
        
        // Get total stories count
        const totalStories = await storiesModel.countDocuments({});
        
        // Get stories from this month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const thisMonthStories = await storiesModel.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });
        
        // Get total active travelers (users)
        const activeTravelers = await userModel.countDocuments({});
        
        // Get total destinations
        const totalDestinations = await destinationModel.countDocuments({});
        
        console.log('Stats calculated:', {
            totalStories,
            thisMonthStories,
            activeTravelers,
            totalDestinations
        });
        
        res.status(200).json({
            success: true,
            stats: {
                totalStories,
                thisMonthStories,
                activeTravelers,
                totalDestinations
            }
        });
        
    } catch (error) {
        console.error('Error getting community stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching community stats"
        });
    }
};

// Get trending topics based on story content analysis
const getTrendingTopics = async (req, res) => {
    try {
        console.log('Getting trending topics...');
        
        // Get all stories
        const stories = await storiesModel.find({}, 'content title location');
        
        // Simple keyword analysis - you can make this more sophisticated
        const topicsCount = {};
        const commonWords = ['solo', 'budget', 'adventure', 'food', 'culture', 'luxury', 'beach', 'mountain', 'city', 'nature'];
        
        stories.forEach(story => {
            const text = `${story.content} ${story.title} ${story.location}`.toLowerCase();
            commonWords.forEach(word => {
                if (text.includes(word)) {
                    topicsCount[word] = (topicsCount[word] || 0) + 1;
                }
            });
        });
        
        // Convert to trending format and sort
        const trending = Object.entries(topicsCount)
            .map(([topic, count]) => ({
                topic: `#${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
                posts: count
            }))
            .sort((a, b) => b.posts - a.posts)
            .slice(0, 5); // Top 5 trending topics
        
        // Add some default topics if we don't have enough data
        const defaultTopics = [
            { topic: '#SoloTravel', posts: Math.floor(stories.length * 0.3) },
            { topic: '#BudgetTrip', posts: Math.floor(stories.length * 0.25) },
            { topic: '#Adventure', posts: Math.floor(stories.length * 0.2) }
        ];
        
        const finalTrending = trending.length > 0 ? trending : defaultTopics;
        
        console.log('Trending topics calculated:', finalTrending);
        
        res.status(200).json({
            success: true,
            trending: finalTrending
        });
        
    } catch (error) {
        console.error('Error getting trending topics:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching trending topics"
        });
    }
};

export { getCommunityStats, getTrendingTopics };