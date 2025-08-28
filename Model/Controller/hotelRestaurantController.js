import hotelModel from "../models/hotelModel.js";
import restaurantModel from "../models/restaurantModel.js";
import reviewsModel from "../models/reviews.js";
import { v2 as cloudinary } from "cloudinary";

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.find({}).sort({ date: -1 });
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({}).sort({ date: -1 });
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single hotel by ID
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id).populate("reviewsList");

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantModel
      .findById(id)
      .populate("reviewsList");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add review to hotel
const addHotelReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, review, rating, userId, userName } = req.body;

    // Find the hotel
    const hotel = await hotelModel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Handle image upload if present
    let imageUrl = null;
    if (req.file) {
      try {
        console.log("Uploading file:", req.file.filename);
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
      }
    }

    // Create new review
    const newReview = new reviewsModel({
      title,
      review,
      rating: parseFloat(rating),
      ...(imageUrl && { image: imageUrl }),
      userId,
      userName,
      date: new Date().toISOString(),
    });

    const savedReview = await newReview.save();

    // Add review to hotel and update rating
    hotel.reviewsList.push(savedReview._id);
    hotel.reviews = hotel.reviewsList.length;

    // Calculate new average rating
    const allReviews = await reviewsModel.find({
      _id: { $in: hotel.reviewsList },
    });
    const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    hotel.rating = totalRating / allReviews.length;

    await hotel.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: savedReview });
  } catch (error) {
    console.error("Error adding hotel review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add review to restaurant
const addRestaurantReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, review, rating, userId, userName } = req.body;

    // Find the restaurant
    const restaurant = await restaurantModel.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Handle image upload if present
    let imageUrl = null;
    if (req.file) {
      try {
        console.log("Uploading file:", req.file.filename);
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Don't fail the entire request if image upload fails
      }
    }

    // Create new review
    const newReview = new reviewsModel({
      title,
      review,
      rating: parseFloat(rating),
      ...(imageUrl && { image: imageUrl }),
      userId,
      userName,
      date: new Date().toISOString(),
    });

    const savedReview = await newReview.save();

    // Add review to restaurant and update rating
    restaurant.reviewsList.push(savedReview._id);
    restaurant.reviews = restaurant.reviewsList.length;

    // Calculate new average rating
    const allReviews = await reviewsModel.find({
      _id: { $in: restaurant.reviewsList },
    });
    const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    restaurant.rating = totalRating / allReviews.length;

    await restaurant.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: savedReview });
  } catch (error) {
    console.error("Error adding restaurant review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new hotel (for admin)
const createHotel = async (req, res) => {
  try {
    const { name, rating, location } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newHotel = new hotelModel({
      name,
      rating: parseFloat(rating) || 5,
      image: imageUrl,
      location,
      date: new Date().toISOString(),
      reviews: 0,
      reviewsList: [],
    });

    await newHotel.save();
    res
      .status(201)
      .json({ message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new restaurant (for admin)
const createRestaurant = async (req, res) => {
  try {
    const { name, rating, location } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newRestaurant = new restaurantModel({
      name,
      rating: parseFloat(rating) || 5,
      image: imageUrl,
      location,
      date: new Date().toISOString(),
      reviews: 0,
      reviewsList: [],
    });

    await newRestaurant.save();
    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//admin part

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await hotelModel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete associated reviews
    await reviewsModel.deleteMany({ _id: { $in: hotel.reviewsList } });

    // Delete hotel
    await hotelModel.findByIdAndDelete(id);

    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await restaurantModel.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Delete associated reviews
    await reviewsModel.deleteMany({ _id: { $in: restaurant.reviewsList } });

    // Delete restaurant
    await restaurantModel.findByIdAndDelete(id);

    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { type, placeId } = req.body; // 'hotel' or 'restaurant'

    // Delete the review
    await reviewsModel.findByIdAndDelete(reviewId);

    // Update the hotel/restaurant
    const Model = type === "hotel" ? hotelModel : restaurantModel;
    const place = await Model.findById(placeId);

    if (place) {
      place.reviewsList.pull(reviewId);
      place.reviews = place.reviewsList.length;

      // Recalculate average rating
      if (place.reviewsList.length > 0) {
        const allReviews = await reviewsModel.find({
          _id: { $in: place.reviewsList },
        });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        place.rating = totalRating / allReviews.length;
      } else {
        place.rating = 5; // Default rating when no reviews
      }

      await place.save();
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewsModel.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllHotels,
  getAllRestaurants,
  getHotelById,
  getRestaurantById,
  addHotelReview,
  addRestaurantReview,
  createHotel,
  createRestaurant,
  deleteHotel,
  deleteRestaurant,
  deleteReview,
  getAllReviews,
};
