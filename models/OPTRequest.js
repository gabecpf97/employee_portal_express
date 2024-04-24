const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const OPTRequestSchema = new Schema({
    userId: { type: refType, ref:"User" },
    step: { type: Number, required: true }, //indicating which step user at, starts at 1, plus 1 if one file is approved, 4 is max
    OPTReceipt: {
        status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
        document: {type: String}, //link to file uploaded
        feedback: {type: String}
    },
    OPTEAD: {
        status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
        document: {type: String}, //link to file uploaded
        feedback: {type: String}
    },
    I983: {
        status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
        document: {type: String}, //link to file uploaded
        feedback: {type: String}
    },
    I20: {
        status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
        document: {type: String}, //link to file uploaded
        feedback: {type: String}
    },
});

const OPTRequest = mongoose.model("OPTRequest", OPTRequestSchema, "OPTRequest");

module.exports = OPTRequest;