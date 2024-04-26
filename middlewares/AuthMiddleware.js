import jwt from 'jsonwebtoken';
import validator from 'validator';

const jwtValidation = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token || validator.isEmpty(token)) {
        return res.status(401).json({
            message: 'No token provided',
        });
    }

  // decode token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded.id || !validator.isMongoId(decoded.id)) {
        return res.status(401).json({
            message: 'Invalid token',
        });
    }
    console.log(decoded)
  // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions
    
    req.body.userId = decoded.id;
    req.body.username = decoded.username;

    next();
};

export default jwtValidation;