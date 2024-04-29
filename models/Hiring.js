import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const HiringSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true , default: "sent"}, //sent , used
    link: { type: String, required: true }, //registration link with token embedded
});

const Hiring = mongoose.model("Hiring", HiringSchema, "Hiring");

export default Hiring;