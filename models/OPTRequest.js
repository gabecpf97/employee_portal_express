import mongoose from "mongoose";
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const OPTRequestSchema = new Schema({
  userId: { type: refType, ref: "User" },
  step: { type: String, required: true }, //indicating which step user at "OPTReceipt" / "OPTEAD" / "I983" / "I20"
  OPTReceipt: {
    status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
    document: { type: String }, //link to file uploaded
    feedback: { type: String },
  },
  OPTEAD: {
    status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
    document: { type: String }, //link to file uploaded
    feedback: { type: String },
  },
  I983: {
    status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
    document: { type: String }, //link to file uploaded
    feedback: { type: String },
  },
  I20: {
    status: { type: String, required: true }, //unuploaded, pending, rejected, approved. Initiate to unuploaded
    document: { type: String }, //link to file uploaded
    feedback: { type: String },
  },
});

const OPTRequest = mongoose.model("OPTRequest", OPTRequestSchema, "OPTRequest");

export default OPTRequest;
