import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, MessageSquare, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HotelRestaurantDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    review: '',
    rating: 5,
    image: null
  });

  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${type}s/${id}`);
      const result = await response.json();
      setData(result);
      setReviews(result.reviewsList || []);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newReview.title);
      formData.append('review', newReview.review);
      formData.append('rating', newReview.rating);
      formData.append('userId', user._id);
      formData.append('userName', user.name);
      if (newReview.image) {
        formData.append('image', newReview.image);
      }

      const response = await fetch(`/api/${type}s/${id}/reviews`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setNewReview({ title: '', review: '', rating: 5, image: null });
        setShowReviewForm(false);
        fetchDetails(); // Refresh data
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={interactive ? 24 : 16}
        className={`${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => onRatingChange(i + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Found</h2>
          <p className="text-gray-600 mb-4">The {type} you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/hotel_restaurants')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to {type === 'hotel' ? 'Hotels' : 'Restaurants'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/hotel_restaurants')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to {type === 'hotel' ? 'Hotels' : 'Restaurants'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  type === 'hotel' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {type === 'hotel' ? 'Hotel' : 'Restaurant'}
                </span>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{data.location}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(data.rating)}</div>
                  <span className="text-lg font-semibold">{data.rating.toFixed(1)}</span>
                  <span className="text-gray-200">({data.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-200">
                <Calendar size={16} />
                <span>Added on {new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  <MessageSquare size={18} />
                  Write a Review
                </button>
                <button className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  <Heart size={18} />
                  Save
                </button>
                <button className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.title}
                      onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Give your review a title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                      <span className="ml-2 text-gray-600">({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newReview.review}
                      onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Photo (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewReview({...newReview, image: e.target.files[0]})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h3>
              
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No reviews yet</p>
                  <p className="text-sm text-gray-500">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold">
                            {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.title}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt || review.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">{renderStars(review.rating || 5)}</div>
                            <span className="text-sm text-gray-600">
                              {(review.rating || 5).toFixed(1)} stars
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3 leading-relaxed">{review.review}</p>
                          
                          {review.image && (
                            <div className="mt-3">
                              <img
                                src={review.image}
                                alt="Review"
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold capitalize">{type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{data.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold">{data.reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-right">{data.location}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>For more information about this {type}, please contact the establishment directly or check their official website.</p>
                <p className="text-xs text-gray-500">
                  Information provided by the WanderTales community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRestaurantDetail;
