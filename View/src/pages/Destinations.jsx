import React, { useState, useEffect } from 'react';
import { MapPin, Star, TrendingUp, Search } from 'lucide-react';

const Discover = () => {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [destinations, setDestinations] = useState([]);
  

  // Filter options for destination categories
  const filterOptions = ['All', 'Mountains', 'Cities', 'Beaches', 'Culture', 'Adventure'];

  // Mock data - Replace with API calls to your backend
  const mockDestinations = [
    {
      id: 1,
      name: 'Kathmandu, Nepal',
      description: 'Ancient temples, vibrant markets, and mountain views await in Nepal\'s cultural capital.',
      category: 'Cultural Heritage',
      rating: 4.2,
      reviewCount: 1247,
      storyCount: 158,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
      type: 'Culture'
    },
    {
      id: 2,
      name: 'Santorini, Greece',
      description: 'Breathtaking sunsets, white-washed buildings, and crystal-clear waters.',
      category: 'Island Paradise',
      rating: 4.8,
      reviewCount: 2156,
      storyCount: 243,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
      type: 'Beaches'
    },
    {
      id: 3,
      name: 'Iceland',
      description: 'Land of fire and ice with stunning northern lights and dramatic landscapes.',
      category: 'Natural Wonder',
      rating: 4.9,
      reviewCount: 987,
      storyCount: 189,
      image: 'https://images.unsplash.com/photo-1539066021819-8f5e3c8bc334?w=400&h=300&fit=crop',
      type: 'Adventure'
    },
    {
      id: 4,
      name: 'Paris, France',
      description: 'The City of Light offers romance, art, cuisine, and timeless elegance.',
      category: 'Romantic City',
      rating: 4.5,
      reviewCount: 4567,
      storyCount: 823,
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      type: 'Cities'
    }
  ];


  // Mock latest news data
  const mockLatestNews = [
    {
      id: 1,
      title: 'Kathmandu Adventure',
      description: 'Exploring ancient temples and mountain trails',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Santorini Explorer',
      description: 'Sunset views and island hopping adventures',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop'
    }
  ];

  // Initialize data on component mount
  useEffect(() => {
    setDestinations(mockDestinations);
  }, []);

  // Filter destinations based on active filter and search term
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || destination.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter button click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Handle explore stories button click
  const handleExploreStories = (destinationId) => {
    console.log('Explore stories for destination:', destinationId);
  };

  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
          alt="Adventure landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section with Search */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">
              Discover Amazing Places
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Explore breathtaking destinations and share your travel stories with fellow adventurers
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search destinations, stories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                {/* Destination Image */}
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-purple-600 text-sm font-medium rounded-full">
                      {destination.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Destination Info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {destination.description}
                    </p>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {renderStarRating(destination.rating)}
                      <span className="text-gray-700 font-medium">
                        {destination.rating} ({destination.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.storyCount} stories</span>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <button
                    onClick={() => handleExploreStories(destination.id)}
                    className="w-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Explore Places
                  </button>
                </div>
              </div>
            ))}
          </div>


          {/* Latest Travel Stories Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-8">Latest Travel Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockLatestNews.map((story) => (
                <div
                  key={story.id}
                  className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <div className="h-48">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>
                    <button className="text-blue-600 font-semibold hover:text-purple-800 transition-colors">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;