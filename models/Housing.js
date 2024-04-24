const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const HousingSchema = new Schema({
    address: { 
        buildingAptNum: { type: Number, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true }
    }, 
    landlord: { 
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName : { type: String },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    }, 
    furniture: { //count of each furnitures
        bed: { type: Number, required: true },
        mattress: { type: Number, required: true },
        table: { type: Number, required: true },
        chair: { type: Number, required: true }
    },
    residentIds: [{ type: refType, ref:"User" }],
    facilityReportsIds: [{ type: refType, ref:"FacilityReport" }]
});

const Housing = mongoose.model("Housing", HousingSchema, "Housing");

module.exports = Housing;