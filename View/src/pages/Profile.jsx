import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Calendar, User, Camera } from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample user data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const fetchUser = async () => {
      const userData = {
        _id: "507f1f77bcf86cd799439011",
        name: "Digonta Das",
        email: "digonto@example.com",
        profile_description: "Solo male traveler sharing authentic experiences from around the globe ✈️ | Culture enthusiast | Safety advocate",
        follower: 2340,
        following: 1456,
        stories: 18,
        reviews: 32,
        image: ["/api/placeholder/150/150"], // Profile image
        date: 1755984000000, // Mar 15, 2022
        username: "@digonto_wanderer",
        location: "Dhaka, Bangladesh"
      };
      setUser(userData);
    };
    
    fetchUser();
  }, []);

  // Sample stories data
  const stories = [
    {
      id: 1,
      title: "Backpacking Through Southeast Asia: A Life-Changing Journey",
      location: "Southeast Asia",
      date: "Jan 15, 2024",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      likes: 284,
      comments: 47,
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Solo male Travel in Japan: Safety, Culture, and Wonder",
      location: "Japan",
      date: "Jan 10, 2024",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop",
      likes: 456,
      comments: 89,
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Digital Nomad Life in Bali: Working from Paradise",
      location: "Bali, Indonesia",
      date: "Jan 5, 2024",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop",
      likes: 189,
      comments: 34,
      readTime: "7 min read"
    }
  ];

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      title: "Hotel Marina Bay Sands - Singapore",
      rating: 5,
      date: "Jan 12, 2024",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
      excerpt: "Absolutely stunning infinity pool with breathtaking views..."
    },
    {
      id: 2,
      title: "Café Central - Vienna, Austria",
      rating: 4,
      date: "Dec 28, 2023",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=250&fit=crop",
      excerpt: "Historic coffeehouse with incredible architecture and pastries..."
    }
  ];

  // Sample photos
  const photos = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=300&h=300&fit=crop"
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Add API call to follow/unfollow user
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Background */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://www.pinterest.com/ideas/dog-images/951338700348/')"
        }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.image[0] || "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face"}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">{user.username}</p>
                  <div className="flex items-center justify-center md:justify-start text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{user.location}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {formatDate(user.date)}</span>
                  </div>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isFollowing
                      ? 'bg-gray-300 text-gray-700'
                      : 'bg-green-700 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <p className="text-gray-700 mb-6 max-w-2xl">{user.profile_description}</p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3">
                  <div className="text-2xl font-bold text-gray-900">{user.stories}</div>
                  <div className="text-sm text-gray-500">Stories</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl font-bold text-gray-900">{user.reviews}</div>
                  <div className="text-sm text-gray-500">Reviews</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(user.follower)}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="p-3">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(user.following)}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('stories')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'stories'
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Stories ({user.stories})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({user.reviews})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'photos'
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Photos (6)
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div className="grid gap-6">
                {stories.map((story) => (
                  <div key={story.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-48 md:h-32 object-cover"
                        />
                      </div>
                      <div className="p-4 md:w-2/3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                          {story.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{story.location}</span>
                          <span className="mx-2">•</span>
                          <span>{story.date}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              <span>{story.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span>{story.comments}</span>
                            </div>
                          </div>
                          <span>{story.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={review.image}
                          alt={review.title}
                          className="w-full h-48 md:h-32 object-cover"
                        />
                      </div>
                      <div className="p-4 md:w-2/3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                          {review.title}
                        </h3>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </div>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{review.excerpt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg group-hover:opacity-75 transition-opacity duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;