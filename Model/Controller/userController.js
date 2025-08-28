import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import storiesModel from "../models/stories.js";
import reviewsModel from "../models/reviews.js";
import followModel from "../models/followModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin12345") {
      const adminUser = {
        _id: "admin",
        name: "Admin User",
        username: "admin",
        email: "admin@wandertales.com",
        role: "admin",
      };
      const token = createToken("admin");

      return res.json({
        success: true,
        token,
        user: adminUser,
      });
    }

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Check if password is hashed or plain text (for backward compatibility)
    let isMatch;
    if (user.password.startsWith("$2b$")) {
      // Password is hashed
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (for existing users)
      isMatch = password === user.password;

      // Hash the password for future use
      if (isMatch) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await userModel.findByIdAndUpdate(user._id, {
          password: hashedPassword,
        });
      }
    }

    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          location: user.location || "Not specified",
          profile_description: user.profile_description,
          follower: user.follower || 0,
          following: user.following || 0,
          stories: user.stories || 0,
          reviews: user.reviews || 0,
          image: user.image || ["/api/placeholder/150/150"],
          date: user.date || Date.now(),
        },
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Login error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};
// Route to get user's bookmarked stories
const getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Find all bookmarked stories
    const bookmarkedStories = await storiesModel
      .find({ bookmarked: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookmarks: bookmarkedStories || [],
    });
  } catch (error) {
    console.log("Get user bookmarks error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};
// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, location, profile_description } =
      req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if user already exists
    const email_exists = await userModel.findOne({ email });
    const username_exist = await userModel.findOne({ username });

    if (email_exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    if (username_exist) {
      return res.json({ success: false, message: "Username already exists" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      username: username.trim(),
      location: location?.trim() || "Not specified",
      profile_description:
        profile_description?.trim() ||
        "Travel enthusiast sharing amazing experiences ✈️",
      follower: 0,
      following: 0,
      stories: 0,
      reviews: 0,
      image: ["/api/placeholder/150/150"],
      date: Date.now(),
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        location: user.location,
        profile_description: user.profile_description,
        follower: user.follower,
        following: user.following,
        stories: user.stories,
        reviews: user.reviews,
        image: user.image,
        date: user.date,
      },
    });
  } catch (error) {
    console.log("Registration error:", error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.json({ success: false, message: `${field} already exists` });
    }
    res.json({ success: false, message: "Server error. Please try again." });
  }
};

// Route to get user profile
// Route to get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Handle hardcoded admin case
    if (userId === "admin") {
      const adminUser = {
        _id: "admin",
        name: "Admin User",
        username: "admin",
        email: "admin@wandertales.com",
        location: "System",
        profile_description: "System Administrator",
        follower: 0,
        following: 0,
        stories: 0,
        reviews: 0,
        image: ["/api/placeholder/150/150"],
        date: Date.now(),
        role: "admin",
      };

      return res.json({
        success: true,
        user: adminUser,
      });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        location: user.location,
        profile_description: user.profile_description,
        follower: user.follower,
        following: user.following,
        stories: user.stories,
        reviews: user.reviews,
        image: user.image,
        date: user.date,
      },
    });
  } catch (error) {
    console.log("Get profile error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};

// Route to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, location, profile_description } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Prepare update object with only provided fields
    const updateFields = {};
    if (name && name.trim()) updateFields.name = name.trim();
    if (location && location.trim()) updateFields.location = location.trim();
    if (profile_description && profile_description.trim())
      updateFields.profile_description = profile_description.trim();

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateFields, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};

// Route to get user's stories
const getUserStories = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Handle hardcoded admin case - admin has no stories
    if (userId === "admin") {
      return res.json({
        success: true,
        stories: [],
      });
    }

    // Import your stories model
    const stories = await storiesModel
      .find({ "author.userId": userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stories: stories || [],
    });
  } catch (error) {
    console.log("Get user stories error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};

// Route to get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Handle hardcoded admin case - admin has no reviews
    if (userId === "admin") {
      return res.json({
        success: true,
        reviews: [],
      });
    }

    // Import your reviews model
    const reviews = await reviewsModel.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews: reviews || [],
    });
  } catch (error) {
    console.log("Get user reviews error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};

// Route to follow/unfollow user
const followUser = async (req, res) => {
  try {
    const { followerId, followeeId, action } = req.body;

    if (!followerId || !followeeId) {
      return res.json({ success: false, message: "User IDs are required" });
    }

    if (followerId === followeeId) {
      return res.json({ success: false, message: "Cannot follow yourself" });
    }

    const follower = await userModel.findById(followerId);
    const followee = await userModel.findById(followeeId);

    if (!follower || !followee) {
      return res.json({ success: false, message: "User not found" });
    }

    if (action === "follow") {
      // Check if already following
      const existingFollow = await followModel.findOne({
        follower: followerId,
        following: followeeId,
      });

      if (existingFollow) {
        return res.json({
          success: false,
          message: "Already following this user",
        });
      }

      // Create follow relationship
      const newFollow = new followModel({
        follower: followerId,
        following: followeeId,
      });
      await newFollow.save();

      // Increment counts
      await userModel.findByIdAndUpdate(followerId, { $inc: { following: 1 } });
      await userModel.findByIdAndUpdate(followeeId, { $inc: { follower: 1 } });
    } else if (action === "unfollow") {
      // Remove follow relationship
      const deletedFollow = await followModel.findOneAndDelete({
        follower: followerId,
        following: followeeId,
      });

      if (!deletedFollow) {
        return res.json({ success: false, message: "Not following this user" });
      }

      // Decrement counts
      await userModel.findByIdAndUpdate(followerId, {
        $inc: { following: -1 },
      });
      await userModel.findByIdAndUpdate(followeeId, { $inc: { follower: -1 } });
    }

    res.json({
      success: true,
      message:
        action === "follow"
          ? "User followed successfully"
          : "User unfollowed successfully",
    });
  } catch (error) {
    console.log("Follow user error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};
// Route to check follow status
const getFollowStatus = async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;

    if (!followerId || !followeeId) {
      return res.json({ success: false, message: "User IDs are required" });
    }

    const followRelationship = await followModel.findOne({
      follower: followerId,
      following: followeeId,
    });

    res.json({
      success: true,
      isFollowing: !!followRelationship,
    });
  } catch (error) {
    console.log("Get follow status error:", error);
    res.json({ success: false, message: "Server error. Please try again." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    await userModel.findByIdAndDelete(userId);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("Delete user error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.log("Get all users error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
export {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUserStories,
  getUserReviews,
  followUser,
  getFollowStatus,
  followModel,
  getAllUsers,
  deleteUser,
  getUserBookmarks,
};
