import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    reviews: { type: Number, required: true, default: 0 },
    reviewsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews' }]
});

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;