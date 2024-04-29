import User from '../models/User.js';
import Hiring from '../models/Hiring.js';
import argon2 from 'argon2';
import generateToken from '../utils/generateToken.js';
import Housing from '../models/Housing.js';

const CheckRegistrationToken = async (req,res) => {
    const { link } = req.body;
    try{
        const valid_record = await Hiring.findOne({link, status:"sent"}).lean().exec();
        if(!valid_record){
            return res.status(401).send({
                message: "Your registration token has been used or expired, please contact your HR to resend the link"
            });
        }
        return res.status(200).send(
            {email:valid_record.email, message:"Your registration token is valid"});

    }
    catch(error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        });
    }
}


const RegisterPageController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const duplicate = await User.findOne({$or: [{ email: email}, { username: username}]}).lean().exec();
        if (duplicate) {
            console.log("Duplicate identity")
            return res.status(400).send({
                message: "username or email already exists"
            });
        }

        const avaliableHousing = await Housing.aggregate([
            {
                $addFields: {
                    numberOfResidents: { $size: "$residentIds" }
                }
            },
            {
                $match: {
                    numberOfResidents: { $lt: 4 }
                }
            }
            ]).exec();
    
        if (avaliableHousing.length ===0){
            return res.status(409).send(
                {message: "No empty housing available, please contact your HR"});
        }
        const userHousing = avaliableHousing[0]._id;


        // genertate hashed password from argon2
        const hashedPassword = await argon2.hash(password);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            housingId: userHousing,
        });
        console.log("user created successfully");
        // update housing's residentId
        const updateHousing = await Housing.updateOne(
            {_id: userHousing },
            { $push: { residentIds: newUser._id } }
        )

        const token = generateToken(newUser._id, newUser.username);

        //change the registration link to be invalid.
        const hiring_record = await Hiring.findOneAndUpdate({email, status:"sent"},{status:"used"})

        return res.status(201).send(
            {status:"success", 
            token, 
            userStatus: newUser.status, 
            isHR: newUser.isHR });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        });
    }
}


export {RegisterPageController, CheckRegistrationToken};