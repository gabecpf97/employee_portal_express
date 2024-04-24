const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const ApplicationSchema = new Schema({
    userId: { type: refType, ref:"User" },
    status: { type: String, required: true }, //approved, rejected, pending
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String }, 
    preferredName: { type: String }, 
    picture:{type: String, required:true}, //link to a profile img, should have a default one
    address: { 
        buildingAptNum: { type: Number, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true }
    }, 
    cellPhone: { type: String, required:true },
    workPhone: { type: String },
    car:{
        make: {type: String},
        model: {type: String},
        color: {type: String}
    },
    email: {type: String, required:true }, //pre-filled from registratio token
    SSN: {type: String, required:true },
    DOB: {type: String, required:true },
    gender: {type: String }, //male, female, I do not want to answer
    citizenship: {type: String, required:true}, //green card, citizen, non-citizen
    workAuthorization: {
        type: {type: String, required:true }, // h1b, l2, f1cpt, f1opt, h4, other
        document: {type:String}, //upload link to f1opt receipt, optional to other
        startDate: {type: Date, required:true },
        endDate: {type: Date, required:true }
    },
    driverLicense: { //empty if user does not have one
        number: {type: String}, 
        expirationDate: {type:Date},
        document: {type: String}
    },
    reference: { 
        firstName: {type: String, required:true}, 
        lastName: {type: String, required:true}, 
        middleName: {type: String}, 
        phone: {type: String, required:true}, 
        email: {type: String, required:true}, 
        relationship: {type: String, required:true}, 
    },
    emergency: [{ 
        firstName: {type: String, required:true}, 
        lastName: {type: String, required:true}, 
        middleName: {type: String}, 
        phone: {type: String, required:true}, 
        email: {type: String, required:true}, 
        relationship: {type: String, required:true}, 
    }],
    feedback: { type: String }
});

const Application = mongoose.model("Application", ApplicationSchema, "Application");

module.exports = Application;