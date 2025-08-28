import React, { useState, useEffect } from "react";
import { MapPin, Star, TrendingUp, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Destinations = () => {
  const { token } = useAuth(); // For potential auth in future
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter options for destination categories
  const filterOptions = [
    "All",
    "Mountains",
    "Cities",
    "Beaches",
    "Culture",
    "Adventure",
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/destination/list",
          {
            headers: { Authorization: `Bearer ${token}` }, // Optional for now
          }
        );
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setDestinations(data.destinations);
        } else {
          throw new Error(data.message || "Failed to load destinations");
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [token]); // Re-fetch if token changes

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || destination.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderStarRating = (rating) => {
    const stars = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  const handleExploreStories = (id) => {
    console.log("Explore destination:", id); // Replace with navigation to detail page later
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover Destinations
          </h1>
          <div className="flex flex-col text-red-500 sm:flex-row gap-4">
            <div className="relative flex-1 ">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 bg-white text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 " size={16} />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-white">Loading destinations...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-600">
            <p>Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Destinations Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <div
                key={destination._id || destination.id} // Use _id from DB or fallback to mock id
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-48">
                  <img
                    src={destination.image[0] || destination.image} // Handle array or single URL
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-2 bg-white backdrop-blur-sm text-purple-600 text-sm font-medium rounded-full">
                      {destination.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black mb-3">
                      {destination.name}
                    </h3>
                    <p className="text-black text-lg leading-relaxed">
                      {destination.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredDestinations.length === 0 && (
          <div className="text-center py-8 text-white ">
            No destinations found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
