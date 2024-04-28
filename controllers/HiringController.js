import Hiring from "../models/Hiring.js";
import generateRegistration from "../utils/generateRegistration.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import transporter from "../config/email.js";

const getHiringRecords = async (req, res) => {
  try {
    //get sent hiring links with status
    const records = await Hiring.find();

    return res.status(200).json({ records });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendHiringLink = async (req, res) => {
  try {
    //get user email and username
    const {email, name} = req.body
    const registration_token = generateRegistration(email,name)
    const registration_link = `TMP/PLACEHOLDER/URL?token=${registration_token}`
    console.log("registration link: ",registration_link)

    //send email to user
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    dotenv.config({ path: path.join(__dirname, "../.env") });
    const { HR_EMAIL } = process.env;
    
    const mailOptions = {
        from: HR_EMAIL, 
        to: email ,
        subject: "Employee Managament System Registration System",
        text: `Dear ${name}, here is your registration link, please finish registration process within an hour.\n ${registration_link}`
    };

    transporter.sendMail(mailOptions)

    //set all previously sent token to be expired
    const result = await Hiring.updateMany(
        { email: email, status: 'sent' }, 
        { $set: { status: 'expired' } }   
    );

    //create a new hiring records
    const newRecord = await Hiring.create({
        name: name,
        email: email,
        link: registration_link,
        status: "sent",
    });

    return res.status(200).json({ message: "The registration link has been sent to user's email!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getHiringRecords, sendHiringLink };
