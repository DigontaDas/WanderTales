import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Ensure unique follow relationships
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel =
  mongoose.models.follow || mongoose.model("follow", followSchema);

export default followModel;