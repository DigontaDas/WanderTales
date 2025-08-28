import express from "express";
import { addStory, listStories, getSingleStory, likeStory, removeStory } from "../Controller/storiesController.js";
import { addComment, getComments, likeComment, deleteComment } from "../Controller/commentController.js";
import upload from "../middleware/multer.js";
import { toggleBookmark, getBookmarkStatus } from "../Controller/bookmarkController.js";
const storiesRouter = express.Router();

// story routes
storiesRouter.post("/add", upload.fields([{ name: "image", maxCount: 1 }]), addStory);
storiesRouter.get("/list", listStories);
storiesRouter.post("/single", getSingleStory);
storiesRouter.post("/like", likeStory);
storiesRouter.post("/remove", removeStory);
storiesRouter.post("/bookmark-status", getBookmarkStatus);
// comment routes
storiesRouter.post("/comments/add", addComment);
storiesRouter.post("/comments/get", getComments);
storiesRouter.post("/comments/like", likeComment);
storiesRouter.post("/comments/delete", deleteComment);
storiesRouter.post("/bookmark", toggleBookmark);
export default storiesRouter;
