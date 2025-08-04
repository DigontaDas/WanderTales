import express from "express";
import { addStory, listStories, getSingleStory, likeStory, removeStory } from "../Controller/storiesController.js";
import upload from "../middleware/multer.js";

const storiesRouter = express.Router();

storiesRouter.post("/add", upload.fields([{ name: "image", maxCount: 1 }]), addStory);
storiesRouter.get("/list", listStories);
storiesRouter.post("/single", getSingleStory);
storiesRouter.post("/like", likeStory);
storiesRouter.post("/remove", removeStory);

export default storiesRouter;