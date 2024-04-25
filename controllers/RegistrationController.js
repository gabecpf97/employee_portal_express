import {User} from '../models/User.js'
import argon2 from 'argon2';
import generateToken from '../utils/generateToken.js';

const RegisterPageController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const duplicate = await User.findOne({$or: [{ email: email}, { username: username}]}).lean().exec();
        if (duplicate) {
            console.log("Duplicate identity")
            return res.status(400).json({
                message: "username or email already exists"
            });
        }

        // genertate hashed password from argon2
        const hashedPassword = await argon2.hash(password);

        const newUser = new User.create({
            username: username,
            email: email,
            password: hashedPassword,
        });
        console.log("user created successfully");

        const token = generateToken(newUser._id, newUser.username);
        return res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export {RegisterPageController};