import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const { HR_EMAIL, HR_EMAIL_PASSWORD } = process.env;

let transporter = nodemailer.createTransport({
    service:'Zoho',
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: HR_EMAIL,
        pass: HR_EMAIL_PASSWORD,
    },
});

export default transporter
