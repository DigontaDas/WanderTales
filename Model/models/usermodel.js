import mongoose, { mongo } from "mongoose";
const userSchema=new mongoose.Schema({
    name: {type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    // location:{type:String,required:true},
    // profile_description: {type:String,required:true},
    // follower: {type:Number,required:true},
    // following:{type:Number,required:true},
    // stories:{type:Number,required:true},
    // reviews:{type:Number,required:true},
    // image: {type:Array , required:true},
    // date: {type: String, required: true},
})

const userModel=mongoose.models.user || mongoose.model("user",userSchema)

export default userModel

