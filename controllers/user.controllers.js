import http from "http-status";
import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";


const login = async(req,res)=>{
    try{
        const {username,password} = req.body;
        
        if(!username || !password){
            return res.status(http.BAD_REQUEST).json({message:"All fields are required"});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(http.BAD_REQUEST).json({message:"Invalid username or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if(isMatch){
            const token=await crypto.randomBytes(20).toString('hex');
             user.token=token;
             await user.save();
             return res.status(http.OK).json({message:"Login successful", token});
           
        }
         return res.status(http.BAD_REQUEST).json({message:"Invalid username or password"});
        
    } catch (error) {
        res.status(http.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});
    }
};


const register = async(req,res)=>{
    try{
        const {name ,username,password} = req.body;
        if(!name || !username || !password){
            return res.status(http.BAD_REQUEST).json({message:"All fields are required"});
        }
        const userExists = await User.findOne({username});
        if(userExists){
            return res.status(http.BAD_REQUEST).json({message:"Username already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User(
            {
                name:name,
                username:username,
                password:hashedPassword
            });
        await user.save();
        res.status(http.CREATED).json({message:"User registered successfully"});
    } catch (error) {
        res.status(http.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});
    }

}

const getUserHistory=async(req,res)=>{
    const {token}=req.query;
    try {
        const user =await User.findOne({token:token});
        const meetings =await Meeting.find({user_id:user.username});
        res.json(meetings);
        
    } catch (error) {
        res.json({message:`something went wrong ${error}`});
        
    }
}

const addToHistory=async (req,res)=>{
    const {token,meeting_code}=req.body;
    try {
        const user=await User.findOne({token:token});
        const newMeeting =new Meeting({
            user_id:user.username,
            meetingCode:meeting_code
        })
        await newMeeting.save();
        res.status(httpStatus.CREATED).json({message:"Added code to history"})
    } catch (error) {
        res.json({message: `something went wrong ${error}`});
        
    }
}

export { login, register,getUserHistory,addToHistory };











