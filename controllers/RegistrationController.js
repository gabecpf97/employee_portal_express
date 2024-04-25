import User from '../models/User.js'
import argon2 from 'argon2';
import generateToken from '../utils/generateToken.js';
import Housing from '../models/Housing.js'

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
        return res.status(201).send({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        });
    }
}

const createHousing = async (req, res) => {
    try {
        const newHousing = await Housing.create(req.body)
        return res.status(200).send({message: "house created", newHousing});
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

export {RegisterPageController,
    createHousing};