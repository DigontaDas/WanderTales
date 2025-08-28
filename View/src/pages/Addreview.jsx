import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Upload, MapPin, Building, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AddReview = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [reviewData, setReviewData] = useState({
    type: "hotel", // hotel or restaurant
    placeId: "",
    title: "",
    review: "",
    rating: 5,
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchPlaces();
  }, [isAuthenticated, navigate]);

  const fetchPlaces = async () => {
  try {
    setLoading(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const [hotelsRes, restaurantsRes] = await Promise.all([
      fetch(`${backendUrl}/api/hotels`),
      fetch(`${backendUrl}/api/restaurants`),
    ]);

    if (!hotelsRes.ok || !restaurantsRes.ok) {
      throw new Error('Failed to fetch places');
    }

    const hotelsData = await hotelsRes.json();
    const restaurantsData = await restaurantsRes.json();

    setHotels(Array.isArray(hotelsData) ? hotelsData : []);
    setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
  } catch (error) {
    console.error("Error fetching places:", error);
    setHotels([]);
    setRestaurants([]);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!reviewData.placeId) {
    alert("Please select a hotel or restaurant");
    return;
  }

  try {
    setSubmitting(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const formData = new FormData();
    formData.append("title", reviewData.title);
    formData.append("review", reviewData.review);
    formData.append("rating", reviewData.rating);
    formData.append("userId", user._id);
    formData.append("userName", user.name);

    if (reviewData.image) {
      formData.append("image", reviewData.image);
    }

    const response = await fetch(
      `${backendUrl}/api/${reviewData.type}s/${reviewData.placeId}/reviews`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      alert("Review submitted successfully!");
      navigate("/hotel_restaurants");
    } else {
      throw new Error("Failed to submit review");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Error submitting review. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={24}
        className={`${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => onRatingChange(i + 1) : undefined}
      />
    ));
  };

  const getCurrentPlaces = () => {
    return reviewData.type === "hotel" ? hotels : restaurants;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading places...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Experience
            </h1>
            <p className="text-gray-600">
              Help others discover amazing places by sharing your review
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What are you reviewing? *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setReviewData({ ...reviewData, type: "hotel", placeId: "" })
                  }
                  className={`flex items-center justify-center gap-3 p-4 border rounded-lg transition-colors ${
                    reviewData.type === "hotel"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Building size={24} />
                  <span className="font-semibold">Hotel</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReviewData({
                      ...reviewData,
                      type: "restaurant",
                      placeId: "",
                    })
                  }
                  className={`flex items-center justify-center gap-3 p-4 border rounded-lg transition-colors ${
                    reviewData.type === "restaurant"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Utensils size={24} />
                  <span className="font-semibold">Restaurant</span>
                </button>
              </div>
            </div>

            {/* Place Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {reviewData.type === "hotel" ? "Hotel" : "Restaurant"} *
              </label>
              <select
                required
                value={reviewData.placeId}
                onChange={(e) =>
                  setReviewData({ ...reviewData, placeId: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a {reviewData.type}...</option>
                {getCurrentPlaces().map((place) => (
                  <option key={place._id} value={place._id}>
                    {place.name} - {place.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                required
                value={reviewData.title}
                onChange={(e) =>
                  setReviewData({ ...reviewData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Give your review a catchy title"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-2">
                {renderStars(reviewData.rating, true, (rating) =>
                  setReviewData({ ...reviewData, rating })
                )}
                <span className="ml-2 text-gray-600">
                  ({reviewData.rating} star{reviewData.rating !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                required
                rows={5}
                value={reviewData.review}
                onChange={(e) =>
                  setReviewData({ ...reviewData, review: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience in detail. What did you like? What could be improved?"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload images
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            image: e.target.files[0],
                          })
                        }
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {reviewData.image && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {reviewData.image.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/hotel_restaurants")}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
