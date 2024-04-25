import jwt from 'jsonwebtoken';

const generateToken = (id, username) => {
    const token = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    return token;
};

export default generateToken;