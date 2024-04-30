import validator from 'validator';

const editUserValidation = (req, res, next) => {
    const { new_username,  new_password, new_email } = req.body;
    console.log(new_username,  new_password, new_email)
    // Check for missing fields
    if (validator.isEmpty(new_username) && validator.isEmpty(new_password) && validator.isEmpty(new_email)) {
        return res.status(400).json({ message: 'Please provide at least one field!' });
    }

    if(new_username){
        // Username validation
        const usernameMinLength = 3;
        const usernameMaxLength = 20;
        if (!validator.isLength(username, { min: usernameMinLength, max: usernameMaxLength }) || !validator.isAlphanumeric(username, 'en-US')) {
            return res.status(400).json({ message: 'Username must be 3-20 characters and alphanumeric!' });
        }
    }

    if(new_password){
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
    }

    if(new_email){

    
        // Email validation
        const emailMinLength = 6;
        const emailMaxLength = 50; 
        if (!validator.isLength(email, { min: emailMinLength, max: emailMaxLength }) || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email is not valid or length is incorrect!' });
        }
    }

    next();
};

export { editUserValidation };