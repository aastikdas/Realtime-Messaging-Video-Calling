import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const signUp = async (req,res)=>{
    const {email, fullName, password} = req.body
    try {
        if(!fullName || !email || !password)
            return res.status(400).json({message:"All feilds are required"})
        // check for password lenght
        if(password.length<8){
            return res.status(400).json({message:"Password must be of 8 characters"})
        }
        // check for email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Email is not valid"})
        }
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists, please use a different one" });
        }
        const index=Math.floor(Math.random() * 100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            avatar: randomAvatar
        });

        try {
        await upsertStreamUser({
            id:newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.avatar || ""
        })
        console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error creating stream user:", error)
        }
        

        // TODO: we should also signup usuer at stream ass well
        

        const token = jwt.sign(
            {
                userId: newUser._id,
            },
            process.env.JWT_SECRET_KEY,
            {

                expiresIn: "7d",
            }
        )
        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000, //formate of milisecn
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV==="production"
        })
        res.status(201).json({ success:true, user:newUser, message: "User created successfully" });
        
    } catch (error) {
        console.log( "Error in creating user", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const login = async (req,res)=>{
    const {email, password}= req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"All feilds are reuired"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Email is not valid"})
        }

        const user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const isPasswordMatch= await user.matchPassword(password)
        if(!isPasswordMatch){
            return res.status(401).json({message:"Invalid email or password"})
        }
        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET_KEY,
            {

                expiresIn: "7d",
            }
        )
        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000, //formate of milisecn
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV==="production"
        })
        return res.status(200).json({user:user, message:"User loggedin successfully"})
    }
    catch(error){
        console.log("Error in user Login", error);
        res.status(500).json({message:"Internal server error"})
    }
    
}

const logout = async (req,res)=>{
    res.clearCookie("jwt")
    res.status(200).json({message:"Logout successful"})
}

const onboard= async (req,res)=>{
    try {
        const userId = req.user._id;
        const {fullName, bio, location}= req.body
        if(!fullName || !bio || !location)
            return res.status(400).json({
            message:"All fields are required",
            missingFields:[
                !fullName && "fullName",
                !bio && "bio",
                !location && "location",

            ].filter(Boolean),
        })

        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded: true,
        },{new:true})
        if(!updatedUser){
            return res.status(404).json({message:"User not found"})
        }
        // TODO: update user info in stream also
        try {
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name : updatedUser.fullName,
                image:updatedUser.avatar || "",
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating stream user during onboarding:", streamError.message)
        }

        res.status(200).json({success:true, user:updatedUser, message:"User updated successfully"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export {signUp, login, logout, onboard}