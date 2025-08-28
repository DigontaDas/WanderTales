import express from "express"
import {addDestination,listDestination,removeDestination,singleDestination} from "../Controller/destinationController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const DestinationRouter=express.Router()
DestinationRouter.post("/add",adminAuth,upload.fields([{name:"image1",maxCount:1}]),addDestination)
DestinationRouter.post("/remove",removeDestination)
DestinationRouter.post("/single",singleDestination)
DestinationRouter.get("/list",listDestination)

export default DestinationRouter
