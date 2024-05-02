import multer from "multer";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images!", 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFilter });
const uploadImageToMulter = upload.fields([
  { name: "picture", maxCount: 1 },
  { name: "driverLicense_document", maxCount: 1 },
  { name: "workAuthorization_document", maxCount: 1 },
]);

const uploadImageToMulterSafe = (req, res, next) => {
  console.log("in safe");
  uploadImageToMulter(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const generateFileName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");

const saveToAWS = async (req, res, next) => {
  try {
    console.log("in save to aws");
    const paramss = [];
    const keys = {
      picture: "picture_" + generateFileName(),
      DriverLicense: "driverLicense_" + generateFileName(),
      WorkAuthorization: "workAuthorization_" + generateFileName(),
    };

    const file1 = {
      Bucket: process.env.BUCKET_NAME,
      Key: "picture_" + generateFileName(),
      Body: req.files.picture[0].buffer,
      ContentType: req.files.picture[0].mimetype,
    };
    const file2 = {
      Bucket: process.env.BUCKET_NAME,
      Key: "driverLicense_" + generateFileName(),
      Body: req.files.driverLicense_document[0].buffer,
      ContentType: req.files.driverLicense_document[0].mimetype,
    };
    const file3 = {
      Bucket: process.env.BUCKET_NAME,
      Key: "workAuthorization_" + generateFileName(),
      Body: req.files.workAuthorization_document[0].buffer,
      ContentType: req.files.workAuthorization_document[0].mimetype,
    };

    paramss.push(file1);
    paramss.push(file2);
    paramss.push(file3);

    await Promise.all(
      paramss.map((param) => {
        const command = new PutObjectCommand(param);
        S3.send(command);
      })
    );

    const retrieveParams = [];
    for (let i = 0; i < keys.length; i++) {
      retrieveParams.push({
        Bucket: process.env.BUCKET_NAME,
        Key: keys[i],
      });
    }

    for (let i = 0; i < keys.length; i++) {
      const command = new GetObjectCommand(retrieveParams[i]);
      const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
      keys[i] = url;
    }

    req.body.keys = keys;

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const convertFormDataToJson = (req, res, next) => {
  try {
    const { s3Keys } = req.body;
    console.log(req.body);
    const applicationData = {
      ...req.body,
      address: JSON.parse(req.body.address),
      car: JSON.parse(req.body.car),
      reference: JSON.parse(req.body.reference),
      emergency: req.body.emergency.map((contact) => JSON.parse(contact)),
      picture: s3Keys.picture,
      driverLicense: {
        number: req.body.driverLicense_number,
        expirationDate: req.body.driverLicense_expirationDate,
        document: s3Keys.DriverLicense,
      },
      workAuthorization: {
        type: req.body.workAuthorization_type,
        document: s3Keys.WorkAuthorization,
        startDate: req.body.workAuthorization_startDate,
        endDate: req.body.workAuthorization_endDate,
      },
    };

    req.body.application = applicationData;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const retrieveImageUrl = async (req, res, next) => {
  try {
    const keys = req.body.keys;
    console.log(keys);
    const paramss = [
      {
        Bucket: process.env.BUCKET_NAME,
        Key: keys.picture,
      },
      {
        Bucket: process.env.BUCKET_NAME,
        Key: keys.DriverLicense,
      },
      {
        Bucket: process.env.BUCKET_NAME,
        Key: keys.WorkAuthorization,
      },
    ];

    const command = new GetObjectCommand(paramss[0]);
    const picture = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const command2 = new GetObjectCommand(paramss[1]);
    const DriverLicense = await getSignedUrl(S3, command2, { expiresIn: 3600 });
    const command3 = new GetObjectCommand(paramss[2]);
    const WorkAuthorization = await getSignedUrl(S3, command3, {
      expiresIn: 3600,
    });

    req.body.s3Keys = { picture, DriverLicense, WorkAuthorization };
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  uploadImageToMulterSafe,
  saveToAWS,
  convertFormDataToJson,
  retrieveImageUrl,
};
