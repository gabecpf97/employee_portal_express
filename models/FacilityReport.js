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
    }]
});

const FacilityReport = mongoose.model("FacilityReport", FacilityReportSchema, "FacilityReport");

export default FacilityReport;