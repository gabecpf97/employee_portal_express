import { uploadImageToAWS, uploadImageToMulter } from "../config/AWS.js";
import generateFileName from "../utils/generateFileName.js";
import convertFormDataToJson from "../utils/convertFormDataToJson.js";

const uploadImageToMulterSafe = (req, res, next) => {
  console.log("in safe");
  uploadImageToMulter(req, res, (err) => {
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
      picture: "picture_" + generateFileName(),
      DriverLicense: "driverLicense_" + generateFileName(),
      WorkAuthorization: "workAuthorization_" + generateFileName(),
    };

    const files = req.files;

    let picture = "";
    if (files.picture) {
      picture = await uploadImageToAWS(keys.picture, req.files.picture[0]);
    } else {
      throw new Error("Please upload a picture of yourself!");
    }

    let DriverLicense = "";
    if (files.driverLicense_document) {
      DriverLicense = await uploadImageToAWS(
        keys.DriverLicense,
        req.files.driverLicense_document[0]
      );
    }

    let WorkAuthorization = "";
    if (files.workAuthorization_document) {
      WorkAuthorization = await uploadImageToAWS(
        keys.WorkAuthorization,
        req.files.workAuthorization_document[0]
      );
    }

    req.body.s3Keys = {
      picture: picture.split("?")[0],
      DriverLicense: DriverLicense.split("?")[0],
      WorkAuthorization: WorkAuthorization.split("?")[0],
    };

    req.body.application = convertFormDataToJson(req.body);
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { uploadImageToMulterSafe, saveToAWS };
