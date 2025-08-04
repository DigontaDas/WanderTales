import mongoose, { mongo } from "mongoose";
const destinationSchema=new mongoose.Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    rating:{type:Number,required:true},
    image: {type:Array , required:true},
    category: {type: String, required: true},
    used_in_stories: {type: Number, required: true}
})

const destinationModel=mongoose.models.destination || mongoose.model("destination",destinationSchema)

export default destinationModel

