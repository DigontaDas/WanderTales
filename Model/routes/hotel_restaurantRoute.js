import express from 'express';
import multer from 'multer';
import {
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
} from '../Controller/hotelRestaurantController.js';
import adminAuth from '../middleware/adminAuth.js';
const hotelRestaurantRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Hotel routes
hotelRestaurantRouter.get('/hotels', getAllHotels);
hotelRestaurantRouter.get('/hotels/:id', getHotelById);
hotelRestaurantRouter.post('/hotels/:id/reviews', upload.single('image'), addHotelReview);
hotelRestaurantRouter.post('/hotels', upload.single('image'), createHotel);

// Restaurant routes
hotelRestaurantRouter.get('/restaurants', getAllRestaurants);
hotelRestaurantRouter.get('/restaurants/:id', getRestaurantById);
hotelRestaurantRouter.post('/restaurants/:id/reviews', upload.single('image'), addRestaurantReview);
hotelRestaurantRouter.post('/restaurants', upload.single('image'), createRestaurant);
//admin 
hotelRestaurantRouter.delete('/admin/hotels/:id', adminAuth, deleteHotel);
hotelRestaurantRouter.delete('/admin/restaurants/:id', adminAuth, deleteRestaurant);
hotelRestaurantRouter.delete('/admin/reviews/:reviewId', adminAuth, deleteReview);
hotelRestaurantRouter.get('/admin/reviews', adminAuth, getAllReviews);
export default hotelRestaurantRouter;