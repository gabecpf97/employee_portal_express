const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true }, //not start, rejected, pending, approved
    isHR: { type: Boolean, required: true}, //true=>HR, false=>user
    applicationId: { type: refType, ref:"Application" },
    housingId: { type: refType, ref:"Housing" }
});

const User = mongoose.model("User", UserSchema, "User");

module.exports = User;