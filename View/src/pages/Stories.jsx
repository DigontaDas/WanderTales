import React, { useState, useEffect } from "react";
import {
  User,
  Heart,
  MessageCircle,
  Clock,
  MapPin,
  Plus,
  X,
  Search,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Stories = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedStories, setLikedStories] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [communityStats, setCommunityStats] = useState({
    totalStories: 0,
    thisMonthStories: 0,
    activeTravelers: 0,
    totalDestinations: 0,
  });
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    readTime: "",
    content: "",
    image: null,
  });

  // Make sure your backend URL is correct - check your env file
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const categories = [
    "All",
    "Adventure",
    "Food",
    "Culture",
    "Budget",
    "Luxury",
    "Solo",
  ];

  useEffect(() => {
    fetchStories();
    fetchCommunityStats();
  }, []);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching from:", `${backendUrl}/api/stories/list`);

      const response = await fetch(`${backendUrl}/api/stories/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data.success) {
        setStories(data.stories || []);
      } else {
        console.error("API returned error:", data.message);
        setStories([]);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunityStats = async () => {
    try {
      console.log(
        "Fetching community stats from:",
        `${backendUrl}/api/stats/community`
      );

      const response = await fetch(`${backendUrl}/api/stats/community`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched stats:", data);

      if (data.success) {
        setCommunityStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching community stats:", error);
      // Keep default values if fetch fails
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to share your story");
      navigate("/login");
      return;
    }
    // Validate required fields
    if (
      !formData.title ||
      !formData.location ||
      !formData.readTime ||
      !formData.content
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("readTime", formData.readTime);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("token", token);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      console.log("Submitting to:", `${backendUrl}/api/stories/add`);

      const response = await fetch(`${backendUrl}/api/stories/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Submit response:", data);

      if (data.success) {
        alert("Story added successfully!");
        setShowAddForm(false);
        setFormData({
          title: "",
          location: "",
          readTime: "",
          content: "",
          image: null,
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        fetchStories();
        fetchCommunityStats(); // Refresh stats after adding new story
 
      } else {
        alert(data.message || "Error adding story");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      alert(`Error adding story: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    try {
      const response = await fetch(`${backendUrl}/api/stories/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLikedStories((prev) => {
          const newLiked = new Set(prev);
          if (newLiked.has(storyId)) {
            newLiked.delete(storyId);
          } else {
            newLiked.add(storyId);
          }
          return newLiked;
        });
        fetchStories(); // Refresh to show updated likes
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  //filtering stories based on search and category
  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.content &&
        story.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Travel Stories</h1>
          <p className="text-2xl text-white/90 mb-8">
            Share your adventures and discover amazing journeys from fellow
            travelers
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories by title, location, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg bg-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              disabled={isLoading}
              className="bg-white text-blue-600 text-xl px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Plus size={20} />
              {isLoading ? "Loading..." : "Share Your Story"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Stories Feed */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">Loading stories...</div>
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="text-center py-12 ">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-00 mb-2">
                    No stories found
                  </h3>
                  <p className="text-gray-600">
                    Be the first to share your travel story!
                  </p>
                </div>
              ) : (
                filteredStories.map((story) => (
                  <div
                    key={story._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Story Header */}
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img
                            src={
                              story?.author?.profileImage ||
                              "https://imgs.search.brave.com/NipyceKQPtZaPfH0RF48R5LhQer1pG9rgXuw-A9vRaI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8x/MC82OS91c2VyLWlj/b24tbWluaW1hbC1k/ZXNpZ24tbG9nby1z/aWxob3VldHRlLW1v/ZGVybi12ZWN0b3It/NTMyNzEwNjkuanBn"
                            }
                            alt={story?.author?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://imgs.search.brave.com/NipyceKQPtZaPfH0RF48R5LhQer1pG9rgXuw-A9vRaI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8x/MC82OS91c2VyLWlj/b24tbWluaW1hbC1k/ZXNpZ24tbG9nby1z/aWxob3VldHRlLW1v/ZGVybi12ZWN0b3It/NTMyNzEwNjkuanBn";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-2xl text-gray-800">
                            {story.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-xl mb-1">
                            <span
                              className="font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                              onClick={() =>
                                navigate(`/user/${story.author?.userId}`)
                              }
                            >
                              by {story.author?.name || "Anonymous"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {story.author?.username || "@anonymous"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500 text-xl">
                            <MapPin size={16} className="mr-1" />
                            <span className="mr-4">{story.location}</span>
                            <Clock size={16} className="mr-1" />
                            <span className="mr-4">{story.readTime}</span>
                            <span>{story.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Story Content Preview */}
                      <div className="mb-4">
                        <p className="text-gray-700 text-xl line-clamp-3">
                          {story.content
                            ? story.content.substring(0, 200) + "..."
                            : "Click to read this amazing travel story!"}
                        </p>
                      </div>

                      {/* Story Image */}
                      {story.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Interaction Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(story._id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                              likedStories.has(story._id)
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Heart
                              size={30}
                              className={
                                likedStories.has(story._id)
                                  ? "fill-current"
                                  : ""
                              }
                            />
                            <span>{story.likes || 0}</span>
                          </button>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MessageCircle size={30} />
                            <span>{story.comments || 0}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/story/${story._id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xl"
                        >
                          Read Full Story
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xl">Total Stories</span>
                    <span className="font-semibold">
                      {communityStats.totalStories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xl">This Month</span>
                    <span className="font-semibold">
                      {communityStats.thisMonthStories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xl">
                      Active Travelers
                    </span>
                    <span className="font-semibold">
                      {communityStats.activeTravelers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xl">Destinations</span>
                    <span className="font-semibold">
                      {communityStats.totalDestinations}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Story Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Share Your Travel Story
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give your story an engaging title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xl font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Where did you travel?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-medium text-gray-700 mb-2">
                      Read Time *
                    </label>
                    <input
                      type="text"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 min read"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Your Story *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="8"
                    placeholder="Share your travel experience, tips, and memorable moments..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-m text-gray-500 mt-1">
                    Upload a beautiful photo from your trip (Max 5MB)
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Publishing..." : "Publish Story"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {selectedStory.image && (
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <button
                onClick={closeStoryModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-600 hover:text-gray-800 shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedStory.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin size={18} className="mr-2" />
                <span className="mr-6">{selectedStory.location}</span>
                <Clock size={18} className="mr-2" />
                <span className="mr-6">{selectedStory.readTime}</span>
                <span className="text-sm">{selectedStory.date}</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedStory.content ||
                    "This is an amazing travel story! The full content will be displayed here when available."}
                </p>
              </div>
              <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                <button
                  onClick={() => handleLike(selectedStory._id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart size={20} />
                  <span>{selectedStory.likes || 0} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle size={20} />
                  <span>{selectedStory.comments || 0} Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
