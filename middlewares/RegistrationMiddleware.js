import validator from 'validator';

const createUserValidation = (req, res, next) => {
    const { username,  password, email } = req.body;
    console.log(username,  password, email)
    // Check for missing fields
    if (validator.isEmpty(username) || validator.isEmpty(password) || validator.isEmpty(email)) {
        return res.status(400).json({ message: 'Missing required fields!' });
    }

    // Username validation
    const usernameMinLength = 3;
    const usernameMaxLength = 20;
    if (!validator.isLength(username, { min: usernameMinLength, max: usernameMaxLength }) || !validator.isAlphanumeric(username, 'en-US')) {
        return res.status(400).json({ message: 'Username must be 3-20 characters and alphanumeric!' });
    }

    // Email validation
    const emailMinLength = 6;
    const emailMaxLength = 50; 
    if (!validator.isLength(email, { min: emailMinLength, max: emailMaxLength }) || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid or length is incorrect!' });
    }

    // Password validation
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return res.status(400).json({ message: 'Password must be strong! It must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.' });
    }

    next();
};

export { createUserValidation };