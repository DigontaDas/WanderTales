import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  User,
  Camera,
  UserPlus,
  UserCheck,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { user: currentUser, token, isAuthenticated } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState("stories");
  const [isFollowing, setIsFollowing] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userPhotos, setUserPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const targetUserId = userId || currentUser?._id;
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    profile_description: "",
  });
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  // Check if viewing own profile
  const isOwnProfile = currentUser && currentUser._id === targetUserId;

  useEffect(() => {
    if (targetUserId) {
      fetchUserProfile();
      fetchUserContent();
      if (isAuthenticated && !isOwnProfile) {
        checkFollowStatus();
      }
    }
  }, [targetUserId, isAuthenticated]);
  const handleEditProfile = () => {
    setEditForm({
      name: profileUser.name || "",
      location: profileUser.location || "",
      profile_description: profileUser.profile_description || "",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser._id,
          ...editForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProfileUser(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: targetUserId }),
      });

      const data = await response.json();
      if (data.success) {
        setProfileUser(data.user);
        setFollowersCount(data.user.follower || 0);
        setFollowingCount(data.user.following || 0);
      } else {
        console.error("Error fetching user profile:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContent = async () => {
    try {
      let storiesData = null;
      let reviewsData = null;

      // Fetch user's stories
      const storiesResponse = await fetch(`${backendUrl}/api/user/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: targetUserId }),
      });

      if (storiesResponse.ok) {
        storiesData = await storiesResponse.json();
        if (storiesData.success) {
          setUserStories(storiesData.stories || []);
        }
      }

      // Fetch user's reviews
      const reviewsResponse = await fetch(`${backendUrl}/api/user/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: targetUserId }),
      });

      if (reviewsResponse.ok) {
        reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setUserReviews(reviewsData.reviews || []);
        }
      }

      // Fetch bookmarked stories (only for own profile)
      if (isOwnProfile && isAuthenticated) {
        try {
          const bookmarksResponse = await fetch(
            `${backendUrl}/api/stories/list`
          );
          if (bookmarksResponse.ok) {
            const allStoriesData = await bookmarksResponse.json();
            if (allStoriesData.success) {
              // Filter bookmarked stories
              const bookmarkedStories = allStoriesData.stories.filter(
                (story) => story.bookmarked === true
              );
              setUserBookmarks(bookmarkedStories || []);
            }
          }
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      }

      // Generate photos from stories and reviews
      const photos = [];
      if (storiesData?.stories) {
        storiesData.stories.forEach((item) => {
          if (item.image && item.image !== "/api/placeholder/150/150") {
            photos.push(item.image);
          }
        });
      }
      if (reviewsData?.reviews) {
        reviewsData.reviews.forEach((item) => {
          if (item.image && item.image !== "/api/placeholder/150/150") {
            photos.push(item.image);
          }
        });
      }
      setUserPhotos(photos);
    } catch (error) {
      console.error("Error fetching user content:", error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/follow-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          followerId: currentUser._id,
          followeeId: targetUserId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          followerId: currentUser._id,
          followeeId: targetUserId,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">User not found</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-xl text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to previous page
          </button>
        </div>
      </div>

      {/* Header Background */}
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "",
        }}
      >
        <div className="relative inset-0 bg-gray-500 bg-opacity-40">
          <img
                src="https://cdn.pixabay.com/photo/2023/10/21/11/46/sunset-8331285_1280.jpg"
                className="w-full h-100 "
              />
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src="https://imgs.search.brave.com/NipyceKQPtZaPfH0RF48R5LhQer1pG9rgXuw-A9vRaI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8x/MC82OS91c2VyLWlj/b24tbWluaW1hbC1k/ZXNpZ24tbG9nby1z/aWxob3VldHRlLW1v/ZGVybi12ZWN0b3It/NTMyNzEwNjkuanBn"
                className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Profile Info */}
            <div>
              {isEditing && isOwnProfile ? (
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="text-3xl font-bold text-gray-900 border rounded px-2 py-1"
                    placeholder="Your name"
                  />

                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="text-lg text-gray-600 border rounded px-2 py-1 block"
                    placeholder="Your location"
                  />
                  <textarea
                    value={editForm.profile_description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        profile_description: e.target.value,
                      })
                    }
                    className="text-gray-700 border rounded px-2 py-1 w-full"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {profileUser.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    @{profileUser.username}
                  </p>
                  <div className="flex items-center justify-center md:justify-start text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{profileUser.location}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {formatDate(profileUser.date)}</span>
                  </div>
                </>
              )}
              {!isEditing && (
                <>
                  <p className="text-gray-700 mb-6 max-w-2xl">
                    {profileUser.profile_description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center mb-6">
                    <div className="p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {userStories.length}
                      </div>
                      <div className="text-sm text-gray-500">Stories</div>
                    </div>
                    <div className="p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {userReviews.length}
                      </div>
                      <div className="text-sm text-gray-500">Reviews</div>
                    </div>
                    <div className="p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatNumber(followersCount)}
                      </div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatNumber(followingCount)}
                      </div>
                      <div className="text-sm text-gray-500">Following</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Button section */}
            <div className="flex gap-2">
              {isEditing && isOwnProfile ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {/* Follow/Unfollow button for other users */}
                  {!isOwnProfile && isAuthenticated && (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                        isFollowing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  )}

                  {/* Edit Profile button for own profile */}
                  {isOwnProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("stories")}
                className={`py-4 px-6 font-medium text-xl ${
                  activeTab === "stories"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Stories ({userStories.length})
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-6 font-medium text-xl ${
                  activeTab === "reviews"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({userReviews.length})
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`py-4 px-6 font-medium text-xl ${
                  activeTab === "photos"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Photos ({userPhotos.length})
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`py-4 px-6 font-medium text-xl ${
                    activeTab === "bookmarks"
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Bookmarks ({userBookmarks.length})
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Stories Tab */}
            {activeTab === "stories" && (
              <div className="grid gap-6">
                {userStories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <MessageCircle size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No stories yet
                    </h3>
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Start sharing your travel adventures!"
                        : "This user hasn't shared any stories yet."}
                    </p>
                  </div>
                ) : (
                  userStories.map((story) => (
                    <div
                      key={story._id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => navigate(`/story/${story._id}`)}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-48 md:h-32 object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-2/3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600">
                            {story.title}
                          </h3>
                          <div className="flex items-center text-xl text-gray-500 mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{story.location}</span>
                            <span className="mx-2">•</span>
                            <span>{story.date}</span>
                          </div>
                          <div className="flex items-center justify-between text-xl text-gray-500">
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
                  ))
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="grid gap-6">
                {userReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <MessageCircle size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Share your experiences about places you've visited!"
                        : "This user hasn't written any reviews yet."}
                    </p>
                  </div>
                ) : (
                  userReviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={review.image}
                            alt={review.title}
                            className="w-full h-48 md:h-32 object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-2/3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600">
                            {review.title}
                          </h3>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </div>
                            ))}
                            <span className="ml-2 text-xl text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xl">
                            {review.review?.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userPhotos.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Camera size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No photos yet
                    </h3>
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Photos from your stories and reviews will appear here."
                        : "This user hasn't shared any photos yet."}
                    </p>
                  </div>
                ) : (
                  userPhotos.map((photo, index) => (
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
                  ))
                )}
              </div>
            )}
            {/* Bookmarks Tab - Only for own profile */}
            {activeTab === "bookmarks" && isOwnProfile && (
              <div className="grid gap-6">
                {userBookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Bookmark size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bookmarks yet
                    </h3>
                    <p className="text-gray-600">
                      Stories you bookmark will appear here.
                    </p>
                  </div>
                ) : (
                  userBookmarks.map((story) => (
                    <div
                      key={story._id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => navigate(`/story/${story._id}`)}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-48 md:h-32 object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-2/3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600">
                            {story.title}
                          </h3>
                          <div className="flex items-center text-xl text-gray-500 mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{story.location}</span>
                            <span className="mx-2">•</span>
                            <span>{story.date}</span>
                          </div>
                          <div className="flex items-center justify-between text-xl text-gray-500">
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
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
