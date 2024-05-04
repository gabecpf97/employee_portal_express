import crypto from "crypto";

const generateFileName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");

export default generateFileName;
