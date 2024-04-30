import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";

const jwtValidation = (req, res, next) => {
  try{
    console.log("in jwt validation")
    const token = req.headers.authorization.split(" ")[1];
    if (!token || validator.isEmpty(token)) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded.id || !validator.isMongoId(decoded.id)) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    console.log(decoded);
    // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions

    req.body.userId = decoded.id;
    req.body.username = decoded.username;

    next();
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// check whether the user is HR
const restrictToHR = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOne({ _id: userId });

    // check if the user exists or not
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist!",
      });
    }

    // check if the user is HR or not
    if (!user.isHR) {
      return res.status(403).json({
        message: "You have no permission!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { jwtValidation, restrictToHR};
