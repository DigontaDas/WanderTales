import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: false },
    date: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const reviewsModel = mongoose.models.reviews || mongoose.model("reviews", reviewsSchema);

export { reviewsSchema };
export default reviewsModel;