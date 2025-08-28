import {v2 as cloudinary} from 'cloudinary'
import destinationModel from '../models/destinationModel.js';
const addDestination=async(req,res)=>{
    try {
       
        const {name,description,rating,category,used_in_stories}=req.body;
        const image1=req.files.image1 && req.files.image1[0]

        const images=[image1].filter((item)=>item!==undefined)
        let imageurl=await Promise.all(
            images.map(async(item)=>{
                let result=await cloudinary.uploader.upload(item.path,{resource_type:"image"})
                return result.secure_url
            })
        )
        const destinationData={
            name,
            description,
            rating:Number(rating),
            category,
            used_in_stories: Number(used_in_stories),
            image:imageurl
        }
        console.log(destinationData);
        const destination= new destinationModel(destinationData)
        await destination.save()
        res.json({success: true,message: "Destination added"})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error);
        
    }
}
const listDestination=async(req,res)=>{
    try {
        const destinations=await destinationModel.find({})
        res.json({success:true,destinations})
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error);
    }
}

const removeDestination=async(req,res)=>{
    try {
        await destinationModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Destination Removed"})

    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error);
    }
}
const singleDestination=async(req,res)=>{
    try {
        const {destinationId}=req.body
        const destination=await destinationModel.findById(destinationId)
        res.json({success:true,destination})
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error);
    }
}
export {addDestination,listDestination,removeDestination,singleDestination}
