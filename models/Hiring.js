import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const HiringSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: String, required: true , default: "sent"}, //sent, used, expired
    
});

const Hiring = mongoose.model("Hiring", HiringSchema, "Hiring");

export default Hiring;