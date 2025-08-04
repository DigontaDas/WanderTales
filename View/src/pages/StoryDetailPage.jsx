import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Clock, Calendar, ArrowLeft, Bookmark, User } from 'lucide-react';

const StoryDetailPage = ({ storyId, onBack }) => {
  const [story, setStory] = useState(null);
  const [author, setAuthor] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  // Backend URL - make sure this matches your backend
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    if (storyId) {
      fetchStoryDetails();
    }
  }, [storyId]);

  const fetchStoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching story details for ID:', storyId);
      
      const response = await fetch(`${backendUrl}/api/stories/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Story details response:', data);

      if (data.success) {
        setStory(data.story);
        // For now, create a mock author until you add author info to your backend
        setAuthor({
          _id: "mock_author_id",
          name: "Travel Enthusiast",
          username: "@traveler",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
          bio: "Passionate traveler sharing authentic experiences ✈️",
          verified: false,
          followers: 542,
          following: 328
        });
        
        // You can also fetch comments here if your backend supports it
        // fetchComments(storyId);
        
      } else {
        setError(data.message || 'Story not found');
      }
    } catch (error) {
      console.error('Error fetching story details:', error);
      setError('Failed to load story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/stories/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ storyId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLiked(!liked);
        // Update the story's like count
        setStory(prev => ({ 
          ...prev, 
          likes: liked ? (prev.likes || 1) - 1 : (prev.likes || 0) + 1 
        }));
      }
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      // This will be implemented when you add bookmark functionality to backend
      setBookmarked(!bookmarked);
      console.log('Bookmark functionality - to be implemented in backend');
    } catch (error) {
      console.error('Error bookmarking story:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.content ? story.content.substring(0, 100) + '...' : 'Check out this amazing travel story!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      // This will be implemented when you add comment functionality to backend
      console.log('Comment functionality - to be implemented in backend');
      console.log('New comment:', newComment);
      
      // For now, just clear the comment field
      setNewComment('');
      alert('Comment functionality will be implemented with backend!');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback - you can implement navigation logic here
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading story...</div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">📖</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Story Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The story you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="h-96 bg-cover bg-center relative"
        style={{ 
          backgroundImage: story.image ? `url(${story.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{story.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{story.readTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(story.date || story.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Author Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{author?.name}</h3>
                  <p className="text-sm text-blue-600">{author?.username}</p>
                  <p className="text-sm text-gray-600">{author?.bio}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formatDate(story.date || story.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{story.likes || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{story.comments || 0}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
              <button
                onClick={handleBookmark}
                className={`transition-colors ${
                  bookmarked ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              {story.content ? (
                story.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('##')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('#')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">
                        {paragraph.replace('# ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  This is an amazing travel story! The detailed content will be displayed here.
                </p>
              )}
            </div>

            {/* Additional Story Image */}
            {story.image && (
              <div className="mt-8">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {/* Mock tags for now - you can add tags to your backend later */}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 cursor-pointer">
                  #travel
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 cursor-pointer">
                  #{story.location?.toLowerCase().replace(/\s+/g, '')}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full hover:bg-purple-200 cursor-pointer">
                  #adventure
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-6">Comments ({story.comments || 0})</h3>
            
            {/* Add Comment Section */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this travel story..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-sm">Mike Chen</span>
                      <span className="text-xs text-gray-500 ml-2">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Amazing story! I'm planning a similar trip and this is super helpful. 
                      Thanks for sharing your experience! 🌟
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-sm">Sarah Wilson</span>
                      <span className="text-xs text-gray-500 ml-2">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Love the detailed insights! How was the weather during your visit?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;