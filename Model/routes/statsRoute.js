import express from "express";
import { getCommunityStats, getTrendingTopics } from "../Controller/statsController.js";

const statsRouter = express.Router();

statsRouter.get("/community", getCommunityStats);
statsRouter.get("/trending", getTrendingTopics);

export default statsRouter;