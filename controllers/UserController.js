import User from "../models/User.js";
import Application from "../models/Application.js";
// import * as argon2 from "argon2";
// import generateToken from "../utils/generateToken.js";

const getUserInfo = async (req, res) => {
    try {
        // get credentials from body
        const target_userId = req.params.userid;
        const { userId , username } = req.body;
        const req_userId = userId

        // check if the sender exists
        const sender = await User.findOne({ _id : req_userId });
        if (!sender) {
            return res.status(401).json({
                message: "Sender not found!",
        });
        }

        //check if the sender has access
        if((!sender.isHR) && req_userId !== target_userId){
            return res.status(403).json({
                message: "Can not get other user's information!",
            });
        }

        // check if the target username exists
        const user = await User.findOne({ _id : target_userId });
        if (!user) {
            return res.status(401).json({
                message: "User not found!",
        });
        }

        //get user profile
        const profile = await Application.findOne({ userId : target_userId });
        if ((!profile) || profile.status !== "approved") {
            return res.status(400).json({
                message: "User has not passed onboarding!",
        });
        }

        return res.status(200).json({profile, user});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const editUserInfo = async (req, res) => {
    try {
        // get credentials from body
        console.log("in put")
        const target_userId = req.params.userid;
        const { userId , username , updateData} = req.body;
        const req_userId = userId

        // check if the sender exists
        const sender = await User.findOne({ _id : req_userId });
        if (!sender) {
            return res.status(401).json({
                message: "Sender not found!",
        });
        }

        //check if the sender has access
        if(req_userId !== target_userId){
            return res.status(403).json({
                message: "Can not change other user's information!",
            });
        }

        // check if the target username exists
        const user = await User.findOne({ _id : target_userId });
        if (!user) {
            return res.status(401).json({
                message: "User not found!",
            });
        }

        //get user profile
        const profile = await Application.findOne({ userId : target_userId });
        if ((!profile) || profile.status !== "approved") {
            return res.status(400).json({
                message: "User has not passed onboarding!",
            });
        }

        const updatedProfile = await Application.findByIdAndUpdate(profile._id, updateData, { new: true });

        return res.status(200).json({message:"Your profile has been updated successfully!"});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getUserInfo, editUserInfo };