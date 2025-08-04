import React,{useState} from "react";
function Latest_news() {
  // Mock data - replace this with API call to your MERN backend
  const [stories, setStories] = useState([
    {
      id: 1,
      title: "10 Days in Nepal: From Kathmandu's Chaos to Everest Base Camp",
      description: "An incredible journey through Nepal's diverse landscapes and rich culture. Here's everything you need to know about planning your trip, from visa requirements to the best local restaurants...",
      destination: "Kathmandu Adventure",
      author: {
        name: "Sarah Chen",
        avatar: "SC", // You can use initials or image URLs from your backend
        profileColor: "bg-teal-500"
      },
      timeAgo: "2 days ago",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Adventure"
    },
    {
      id: 2,
      title: "Hidden Gems of Santorini: Beyond the Tourist Crowds",
      description: "Discover the secret spots in Santorini that locals love but tourists rarely find. From hidden beaches to authentic tavernas, this guide will show you the real Greece...",
      destination: "Santorini Explorer",
      author: {
        name: "Mike Johnson",
        avatar: "MJ",
        profileColor: "bg-blue-500"
      },
      timeAgo: "5 days ago",
      rating: 4,
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Culture"
    },
    {
      id: 3,
      title: "Backpacking Through Southeast Asia on $30 a Day",
      description: "Complete budget guide for traveling through Thailand, Vietnam, and Cambodia without breaking the bank. Tips on accommodation, food, transport and must-see attractions...",
      destination: "Southeast Asia Journey",
      author: {
        name: "Emma Wilson",
        avatar: "EW",
        profileColor: "bg-purple-500"
      },
      timeAgo: "1 week ago",
      rating: 5,
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Budget Travel"
    },
    {
      id: 4,
      title: "Northern Lights Magic: 7 Days in Iceland",
      description: "Chase the aurora borealis across Iceland's stunning landscapes. From the Blue Lagoon to the Ring Road, here's your complete guide to experiencing Iceland's winter wonderland...",
      destination: "Iceland Adventure",
      author: {
        name: "David Kim",
        avatar: "DK",
        profileColor: "bg-green-500"
      },
      timeAgo: "2 weeks ago",
      rating: 5,
      image: "https://imgs.search.brave.com/ZXoVldlex_SzMNgKNYm__r1YcZlRygDTEUaoan469Q8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hZHZl/bnR1cmVzLmNvbS9t/ZWRpYS82MTcxL2hv/dy10by10YWtlLXBp/Y3R1cmVzLW9mLXRo/ZS1ub3J0aGVybi1s/aWdodHMtY2FtZXJh/LXRyaXBvZC02Lmpw/Zz9hbmNob3I9Y2Vu/dGVyJm1vZGU9Y3Jv/cCZ3aWR0aD05NzAm/aGVpZ2h0PTY0NSZy/bmQ9MTMyNjMzMTAz/MjgwMDAwMDAwJmZv/cm1hdD1qcGcmcXVh/bGl0eT04MA",
      category: "Adventure"
    }
  ]);

  // Function to handle story click - you'll connect this to your routing later
  const handleStoryClick = (story) => {
    console.log(`Opening story: ${story.title}`);
    // Later: navigate(`/story/${story.id}`) with React Router
  };

  // Function to render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ⭐
      </span>
    ));
  };

  // Simulate loading state (you'll use this when fetching from your backend)
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {isLoading ? (
        // Loading skeleton - shows while fetching data from backend
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Actual story cards
        stories.map((story) => (
          <div 
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Story Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={story.image} 
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-semibold">📍 {story.destination}</p>
              </div>
            </div>

            {/* Story Content */}
            <div className="p-6">
              {/* Author and Meta Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${story.author.profileColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {story.author.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{story.author.name}</p>
                    <p className="text-sm text-gray-500">{story.timeAgo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(story.rating)}
                </div>
              </div>

              {/* Story Title and Description */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {story.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {story.description}
              </p>

              {/* Category Badge */}
              <div className="mt-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  {story.category}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
export default Latest_news