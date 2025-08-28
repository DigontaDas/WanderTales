import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  MapPin,
  Building,
  Utensils,
  MessageSquare,
  Trash2,
  Plus,
  Search,
  Star,
  Eye,
  X,
} from "lucide-react";

const AdminPanel = () => {
  const { user, token, isAuthenticated, loading } = useAuth();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [activeTab, setActiveTab] = useState("users");
  const [dataLoading, setDataLoading] = useState(true); // Fixed: boolean, renamed
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);

  // New states for add modals
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showAddDestination, setShowAddDestination] = useState(false);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    location: "",
    rating: 5, // Add rating field
    image: null,
  });

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    location: "",
    rating: 5, // Add rating field
    image: null,
  });
  const [destinationForm, setDestinationForm] = useState({
    name: "",
    description: "",
    category: "",
    rating: 5,
    used_in_stories: 0,
    image: null,
  });

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      window.location.href = "/login";
      return;
    }

    const isAdmin = user?.role === "admin";
    if (!isAdmin) {
      alert("Access denied. Admin privileges required.");
      window.location.href = "/login";
      return;
    }

    loadData();
  }, [loading, isAuthenticated, user]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadDestinations(),
        loadHotels(),
        loadRestaurants(),
        loadReviews(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Updated fetch functions with better error handling
  const loadUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadDestinations = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/destination/list`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (data.success) setDestinations(data.destinations);
    } catch (error) {
      console.error("Error loading destinations:", error);
    }
  };

  const loadHotels = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/hotels`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error("Error loading hotels:", error);
    }
  };

  const loadRestaurants = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/restaurants`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401)
          console.error("Unauthorized - check token");
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", hotelForm.name);
    formData.append("location", hotelForm.location);
    formData.append("rating", hotelForm.rating);
    if (hotelForm.image) formData.append("image", hotelForm.image);

    try {
      const response = await fetch(`${backendUrl}/api/hotels`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      alert("Hotel added successfully!");
      setShowAddHotel(false);
      setHotelForm({ name: "", location: "", rating: 5, image: null });
      loadData();
    } catch (error) {
      console.error("Error adding hotel:", error);
      alert("Failed to add hotel");
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", restaurantForm.name);
    formData.append("location", restaurantForm.location);
    formData.append("rating", restaurantForm.rating);
    if (restaurantForm.image) formData.append("image", restaurantForm.image);

    try {
      const response = await fetch(`${backendUrl}/api/restaurants`, {
        method: "POST",
        body: formData, // Remove Authorization header for now
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      alert("Restaurant added successfully!");
      setShowAddRestaurant(false);
      setRestaurantForm({ name: "", location: "", rating: 5, image: null });
      loadData();
    } catch (error) {
      console.error("Error adding restaurant:", error);
      alert("Failed to add restaurant");
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", destinationForm.name);
    formData.append("description", destinationForm.description);
    formData.append("category", destinationForm.category);
    formData.append("rating", destinationForm.rating);
    formData.append("used_in_stories", destinationForm.used_in_stories);
    if (destinationForm.image) formData.append("image1", destinationForm.image);

    try {
      const response = await fetch(`${backendUrl}/api/destination/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} - ${data.message || "Unknown error"}`
        );
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to add destination");
      }

      alert("Destination added successfully!");
      setShowAddDestination(false);
      setDestinationForm({
        name: "",
        description: "",
        category: "",
        rating: 5,
        used_in_stories: 0,
        image: null,
      });
      loadData();
    } catch (error) {
      console.error("Error adding destination:", error);
      alert(`Failed to add destination: ${error.message}`);
    }
  };
  // Existing delete functions (e.g., deleteUser, deleteHotel, etc.) - assume they exist or add similar to below
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/admin/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      loadData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteDestination = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/destination/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      loadData();
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

  const deleteHotel = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      loadData();
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/restaurants/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      loadData();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const deleteReview = async (reviewId, type, placeId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, placeId }),
        }
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      loadData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Tabs (existing)
  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "destinations", label: "Destinations", icon: MapPin },
    { id: "hotels", label: "Hotels", icon: Building },
    { id: "restaurants", label: "Restaurants", icon: Utensils },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  // Render functions (updated with add buttons and modals)
  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Users Management</h2>
      </div>
      {dataLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDestinations = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Destinations Management</h2>
        <button
          onClick={() => setShowAddDestination(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Destination
        </button>
      </div>
      {dataLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{dest.name}</h3>
                <p className="text-gray-600">{dest.location}</p>
              </div>
              <button
                onClick={() => deleteDestination(dest._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Destination</h2>
              <button
                onClick={() => setShowAddDestination(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddDestination} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cox's Bazar, Sundarbans"
                  value={destinationForm.name}
                  onChange={(e) =>
                    setDestinationForm({
                      ...destinationForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  placeholder="Describe what makes this destination special..."
                  value={destinationForm.description}
                  onChange={(e) =>
                    setDestinationForm({
                      ...destinationForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={destinationForm.category}
                  onChange={(e) =>
                    setDestinationForm({
                      ...destinationForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Mountains">Mountains</option>
                  <option value="Cities">Cities</option>
                  <option value="Beaches">Beaches</option>
                  <option value="Culture">Culture</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setDestinationForm({
                      ...destinationForm,
                      image: e.target.files[0],
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a high-quality image of the destination
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDestination(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderHotels = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Hotels Management</h2>
        <button
          onClick={() => setShowAddHotel(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Hotel
        </button>
      </div>
      {dataLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.location}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    /* View details logic if needed */
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => deleteHotel(hotel._id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Hotel Modal */}
      {showAddHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Hotel</h2>
              <button
                onClick={() => setShowAddHotel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddHotel} className="space-y-4">
              <input
                type="text"
                placeholder="Hotel Name"
                value={hotelForm.name}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={hotelForm.location}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, location: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={hotelForm.rating || 5}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, rating: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, image: e.target.files[0] })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Add Hotel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderRestaurants = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Restaurants Management</h2>
        <button
          onClick={() => setShowAddRestaurant(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Restaurant
        </button>
      </div>
      {dataLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.location}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    /* View details */
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => deleteRestaurant(restaurant._id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Restaurant</h2>
              <button
                onClick={() => setShowAddRestaurant(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantForm.name}
                onChange={(e) =>
                  setRestaurantForm({ ...restaurantForm, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={restaurantForm.location}
                onChange={(e) =>
                  setRestaurantForm({
                    ...restaurantForm,
                    location: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={restaurantForm.rating || 5}
                onChange={(e) =>
                  setRestaurantForm({
                    ...restaurantForm,
                    rating: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRestaurantForm({
                    ...restaurantForm,
                    image: e.target.files[0],
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Add Restaurant
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Reviews Management</h2>
      {dataLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{review.title}</h3>
                <p className="text-gray-600">{review.review}</p>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" />
                  {review.rating}
                </div>
              </div>
              <button
                onClick={() =>
                  deleteReview(
                    review._id,
                    review.type || "hotel",
                    review.placeId || "placeholder"
                  )
                }
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return renderUsers();
      case "destinations":
        return renderDestinations();
      case "hotels":
        return renderHotels();
      case "restaurants":
        return renderRestaurants();
      case "reviews":
        return renderReviews();
      default:
        return renderUsers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
