import mongoose from "mongoose";
const reviewsSchema=new mongoose.Schema({
    title: {type:String,required:true},
    rating: {type: Number, required: true},
    image: {type:String , required:true},
    excerpt: {type: String, required: true},
    date: {type: String, required: true}
})

const reviewsModel=mongoose.models.reviews || mongoose.model("reviews",reviewsSchema)

export default reviewsModel
