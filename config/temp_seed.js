import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
const { MONGO_URL } = process.env

import Application from "../models/Application.js";
import User from "../models/User.js";

async function run() {
    try {
        await mongoose.connect(MONGO_URL,{dbName:"employee_db"});
        console.log("Connected to DB.");


        // const admin = await User.create({username:"admin", password:"$argon2id$v=19$m=65536,t=3,p=4$qxHAx+vymtBvHaTKrpSVUQ$cAoJlZVZcBeM/vU/9MV4T1v1S1r/2l85TVbexGYiKyY",email:"admin@gmail.com", isAdmin:true,like:[]})
        const new_application = await Application.create(
            {
                userId: "662add58af54f61b2a4c2a4c",
                status: "approved", //approved, rejected, pending
                firstName: "user",
                lastName: "one",
                picture:"picture placeholder", //link to a profile img, should have a default one
                address: { 
                    buildingAptNum: "1607",
                    street: "Some Street",
                    city: "New York",
                    state: "CA",
                    zip: "12345"
                }, 
                cellPhone: "12345",
                car:{
                    make: "BMW",
                    model: "x2",
                    color: "whitw"
                },
                email: "user1@gmail.com", //pre-filled from registratio token
                SSN: "1234567890",
                DOB: "2000/01/01",
                gender: "Male", //male, female, I do not want to answer
                citizenship: "non-citizen", //green card, citizen, non-citizen
                workAuthorization: {
                    type: "f1opt", // h1b, l2, f1cpt, f1opt, h4, other
                    document: "placeholder for document", //upload link to f1opt receipt, optional to other
                    startDate: new Date('2024-01-01'), 
                    endDate: new Date('2024-01-02') 
                },
                driverLicense: { //empty if user does not have one
                    number: "123456", 
                    expirationDate: new Date('2024-01-01'),
                    document: new Date('2024-01-01')
                },
                reference: { 
                    firstName: "Mick", 
                    lastName: "John", 
                    phone: "1112223456", 
                    email: "someemail@gmail.com", 
                    relationship: "parent", 
                },
                emergency: [{ 
                    firstName: "Michelle", 
                    lastName: "James", 
                    phone: "5554443211", 
                    email: "anotheremail@gmail.com", 
                    relationship: "parent", 
                }],
                feedback: ""
            }
        )


    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

run().catch(console.dir);