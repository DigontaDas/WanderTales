import mongoose from "mongoose";

const storiesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true } 
},{
    timestamps: true  // This adds createdAt and updatedAt fields automatically
}
);

const storiesModel = mongoose.models.stories || mongoose.model("stories", storiesSchema);

export default storiesModel;