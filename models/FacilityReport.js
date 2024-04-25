import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const FacilityReportSchema = new Schema({
    housingId: { type: refType, ref:"Housing" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: refType, ref:"User" },
    timestamp: { type: String, required: true },
    status: { type: String, required: true }, //open, in progress, closed
    comments: [{ 
        description: { type: String, required: true },
        createdBy: { type: refType, ref:"User" },
        timestamp: { type: String, required: true }
    }], 
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

const FacilityReport = mongoose.model("FacilityReport", FacilityReportSchema, "FacilityReport");

export default FacilityReport;