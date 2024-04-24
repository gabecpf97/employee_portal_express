const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config(path.join(__dirname, '../.env'));

mongoose.set('strictQuery', false);

const { MONGO_URL } = process.env;
//console.log(MONGO_URL)

mongoose
    .connect(MONGO_URL,{dbName:"employee_db"})
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.error(err));

module.exports = mongoose.connection;