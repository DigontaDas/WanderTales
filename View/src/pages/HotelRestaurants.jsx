import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Eye, Heart } from 'lucide-react';

const HotelRestaurants = () => {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsRes, restaurantsRes] = await Promise.all([
        fetch('/api/hotels'),
        fetch('/api/restaurants')
      ]);
      
      const hotelsData = await hotelsRes.json();
      const restaurantsData = await restaurantsRes.json();
      
      setHotels(hotelsData);
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = () => {
    let data = [];
    
    if (activeTab === 'all') {
      data = [...hotels.map(item => ({ ...item, type: 'hotel' })), 
              ...restaurants.map(item => ({ ...item, type: 'restaurant' }))];
    } else if (activeTab === 'hotels') {
      data = hotels.map(item => ({ ...item, type: 'hotel' }));
    } else {
      data = restaurants.map(item => ({ ...item, type: 'restaurant' }));
    }

    // Apply filters
    if (searchTerm) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== 'all') {
      data = data.filter(item => 
        item.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      data = data.filter(item => item.rating >= minRating);
    }

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleViewDetails = (item) => {
    navigate(`/${item.type}/${item._id}`);
  };

  const handleAddReview = () => {
    navigate('/addreview');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const getUniqueLocations = () => {
    const allLocations = [...hotels, ...restaurants].map(item => item.location);
    return [...new Set(allLocations)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing places...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hotels & Restaurants</h1>
          <p className="text-xl mb-8">Discover and review amazing places to stay and dine</p>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search hotels, restaurants, or locations..."
                  className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="hotels">Hotels</option>
                <option value="restaurants">Restaurants</option>
              </select>
              
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                {getUniqueLocations().map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
            
            <button
              onClick={handleAddReview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              + Share Your Review
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Showing {filteredData().length} results
          </h2>
        </div>

        {filteredData().length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto mb-4" />
              <p className="text-xl">No results found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData().map((item) => (
              <div key={`${item.type}-${item._id}`} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      item.type === 'hotel' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {item.type === 'hotel' ? 'Hotel' : 'Restaurant'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-bold text-gray-800 flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={16} />
                    <span className="text-sm">{item.location}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm text-gray-600">
                      {item.rating.toFixed(1)} ({item.reviews} reviews)
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Added on {new Date(item.date).toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200">
                      <Heart size={16} />
                      <span className="text-sm">{Math.floor(Math.random() * 50)}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelRestaurants;
