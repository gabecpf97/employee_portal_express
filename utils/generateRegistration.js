import jwt from 'jsonwebtoken';

const generateRegistration = (email, name) => {
    const token = jwt.sign({ email, name }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    return token;
};


export default generateRegistration;