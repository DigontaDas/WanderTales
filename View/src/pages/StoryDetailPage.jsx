import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  Bookmark,
  User,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const StoryDetail = () => {
  const { id: storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [author, setAuthor] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Anonymous");
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  useEffect(() => {
    if (storyId) {
      fetchStoryDetails();
      fetchComments();
    } else {
      setError("Story ID not found");
      setLoading(false);
    }
  }, [storyId]);

  const fetchStoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${backendUrl}/api/stories/single`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId }),
      });

      const data = await response.json();

      if (data.success) {
        setStory(data.story);
        if (data.story.author) {
          setAuthor({
            _id: data.story.author.userId,
            name: data.story.author.name,
            username: data.story.author.username,
            email: data.story.author.email,
            bio: "Passionate traveler sharing authentic experiences ✈️",
            verified: false,
            followers: 542,
            following: 328,
          });
        } else {
          setAuthor({
            _id: "unknown",
            name: "Travel Enthusiast",
            username: "@traveler",
            bio: "Passionate traveler sharing authentic experiences ✈️",
            verified: false,
            followers: 542,
            following: 328,
          });
        }
      } else {
        setError(data.message || "Story not found");
      }
    } catch (error) {
      console.error("Error fetching story details:", error);
      setError("Failed to load story. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await fetch(`${backendUrl}/api/stories/comments/get`, {
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
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
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
        setLiked(!liked);
        // Update the story's like count
        setStory((prev) => ({
          ...prev,
          likes: liked ? (prev.likes || 1) - 1 : (prev.likes || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      setBookmarked(!bookmarked);
      console.log("Bookmark functionality - to be implemented in backend");
    } catch (error) {
      console.error("Error bookmarking story:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.content
          ? story.content.substring(0, 100) + "..."
          : "Check out this amazing travel story!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  const handleCommentLike = async (commentId) => {
    try {
      const response = await fetch(`${backendUrl}/api/stories/comments/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId, commentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        fetchComments(); // Refresh comments to show updated likes
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${backendUrl}/api/stories/comments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId,
          comment: newComment,
          authorName: commentAuthor,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setNewComment("");
        fetchComments();
        setStory((prev) => ({
          ...prev,
          comments: data.totalComments,
        }));
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Error posting comment. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">📖</div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Story Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The story you're looking for doesn't exist."}
          </p>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="bg-gray-900 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={goBack}
            className="flex items-center text-white text-xl hover:text-green-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2 " />
            Back to Stories
          </button>
        </div>
      </div>

      <div
        className="h-96 bg-cover bg-center relative"
        style={{
          backgroundImage: story.image
            ? `url(${story.image})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="absolute inset-0 bg-grey-800 bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-7xl font-bold mb-4">
              {story.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-xl">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 mr-1" />
                <span>{story.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-8 h-8 mr-1" />
                <span>{story.readTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-8 h-8 mr-1" />
                <span>{formatDate(story.date || story.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Author Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {story?.author?.name ? (
                    story.author.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div
                  className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
                  onClick={() => navigate(`/user/${story?.author?.userId}`)}
                >
                  <h3 className="font-semibold text-3xl text-gray-900 hover:text-blue-600">
                    {story?.author?.name || "Anonymous"}
                  </h3>
                  <p className="text-2xl text-black">
                    {story?.author?.username || "@anonymous"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xl text-gray-500">
                <span>{formatDate(story.date || story.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-8 h-8 ${liked ? "fill-current" : ""}`} />
                  <span>{story.likes || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-8 h-8" />
                  <span>{story.comments || 0}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
                >
                  <Share2 className="w-8 h-8" />
                  <span>Share</span>
                </button>
              </div>
              <button
                onClick={handleBookmark}
                className={`transition-colors ${
                  bookmarked
                    ? "text-yellow-500"
                    : "text-gray-600 hover:text-yellow-500"
                }`}
              >
                <Bookmark
                  className={`w-8 h-8 ${bookmarked ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-6">
            <div className="prose prose-lg text-2xl max-w-none">
              {story.content ? (
                story.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("##")) {
                    return (
                      <h2
                        key={index}
                        className="text-4xl font-bold mt-8 mb-4 text-gray-900"
                      >
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("#")) {
                    return (
                      <h3
                        key={index}
                        className="text-4xl font-semibold mt-6 mb-3 text-gray-900"
                      >
                        {paragraph.replace("# ", "")}
                      </h3>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className="mb-4 text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  This is an amazing travel story! The detailed content will be
                  displayed here.
                </p>
              )}
            </div>

            {/* Additional Story Image */}
            {story.image && (
              <div className="mt-8">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-4xl font-bold mb-6">
              Comments ({story.comments || 0})
            </h3>

            {/* Add Comment Section */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this travel story..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {loadingComments ? (
              <div className="text-center py-4">
                <div className="text-gray-500">Loading comments...</div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to share your thoughts!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-xl">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-xl text-gray-700 mb-2">
                          {comment.comment}
                        </p>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleCommentLike(comment._id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Heart size={14} />
                            <span className="text-m">{comment.likes || 0}</span>
                          </button>
                        </div>
                      </div>
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

export default StoryDetail;
