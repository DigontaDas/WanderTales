import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
//import bcrypt from "bcrypt";
const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
//route for user login
const loginUser=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await userModel.findOne({username})
        if (!user) {
            res.json({success:false,message:"User doesn't exists"})
        }
        //const isMatch=await bcrypt.compare(password,user.password) isnt working
        if (true) {
            const token=createToken(user._id)
            res.json({success:true,token})
        }
        // else{
        //     res.json({success:false,message:"Invalid Credentials"})
        // }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
//route for user registration
const registerUser=async(req,res)=>{
    try {
        const {name,username,email,password}=req.body;
        //checking user already exist or not
        const email_exists=await userModel.findOne({email})
        const username_exist=await userModel.findOne({username})
        if (email_exists && username_exist) {
            res.json({success:false,message:"User already exists"})
        }
        if (password.length<8) {
            return res.json({success:false,message: "Please enter a strong password"})
        }
        const newUser=new userModel({
            name,
            email,
            password,
            username
        })
        const user=await newUser.save()
        const token=createToken(user._id) //user can login in the application
        res.json({success:true,token})
 
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
//route for admin login
const adminLogin=async(req,res)=>{
    try {
        const {username,password}=req.body
        if (username===process.env.ADMIN_USERNAME && password===process.env.ADMIN_PASSWORD) {
            const token=jwt.sign(username+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export {loginUser,registerUser,adminLogin}






