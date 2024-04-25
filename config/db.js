import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

mongoose.set("strictQuery", false);

const { MONGO_URL } = process.env;
//console.log(MONGO_URL)

mongoose
  .connect(MONGO_URL, { dbName: "employee_db" })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error(err));

export default mongoose.connection;
