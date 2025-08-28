import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    location: {type: String, default: "Not specified"},
    profile_description: {type: String, default: "Travel enthusiast sharing amazing experiences ✈️"},
    follower: {type: Number, default: 0},
    following: {type: Number, default: 0},
    stories: {type: Number, default: 0},
    reviews: {type: Number, default: 0},
    image: {type: Array, default: ["/api/placeholder/150/150"]},
    date: {type: Number, default: Date.now},
    role: {type: String, enum: ['user', 'admin'], default: 'user'}
}, {
    timestamps: true
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel
