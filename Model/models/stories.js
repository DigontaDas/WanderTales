import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    authorName: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Add this
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
});

const storiesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: Number, required: true, default: 0 },
    commentsList: [commentSchema], // Array to store actual comments
    likes: { type: Number, required: true, default: 0 },
    bookmarked: { type: Boolean, default: false }, // Simple bookmark field
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true } ,
    author: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true }
    }
},{
    timestamps: true  // This adds createdAt and updatedAt fields automatically
});

const storiesModel = mongoose.models.stories || mongoose.model("stories", storiesSchema);

export default storiesModel;
