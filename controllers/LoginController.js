import User from "../models/User.js";
import * as argon2 from "argon2";
import generateToken from "../utils/generateToken.js";

const login = async (req, res) => {
  try {
    // get credentials from body
    const { username, password } = req.body;

    // check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    // check if password is correct
    const passwordCorrect = await argon2.verify(user.password, password);
    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Wrong Password!",
      });
    }

    // generate JWT token
    const token = generateToken(user._id, username);

    // send token in cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 3600000 });

    return res.status(200).json({
      status: "success",
      token,
      userStatus: user.status,
      isHR: user.isHR,
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { login };
