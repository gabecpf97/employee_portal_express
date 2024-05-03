import { uploadImageToAWS, uploadOPTImageToMulter } from "../config/AWS.js";
import generateFileName from "../utils/generateFileName.js";

const uploadImageToMulterSafe = (req, res, next) => {
  console.log("in safe");
  uploadOPTImageToMulter(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const saveToAWS = async (req, res, next) => {
  try {
    console.log("in save to aws");
    const keys = {
      document: "OPT_document_" + generateFileName(),
    };

    const url = await uploadImageToAWS(keys.document, req.files.document[0]);

    const document = url.split("?")[0];
    const applicationData = {
      ...req.body,
      document: document,
    };
    req.body = applicationData;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { uploadImageToMulterSafe, saveToAWS };
