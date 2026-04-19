import http from "http-status";
import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


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
        if(!isMatch){
            return res.status(http.BAD_REQUEST).json({message:"Invalid username or password"});
        }
        const token=await crypto.randomBytes(20).toString('hex');
        user.token=token;
        await user.save();
        res.status(http.OK).json({message:"Login successful", token});
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

export { login, register };











