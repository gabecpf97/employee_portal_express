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
const uploadImageToMulter = upload.fields([{ name: "document", maxCount: 1 }]);

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
      document: "OPT_document_" + generateFileName(),
    };

    const file1 = {
      Bucket: process.env.BUCKET_NAME,
      Key: "OPT_document_" + generateFileName(),
      Body: req.files.document[0].buffer,
      ContentType: req.files.document[0].mimetype,
    };

    paramss.push(file1);

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
      document: s3Keys.document,
    };

    console.log(applicationData);

    req.body = applicationData;
    console.log(req.body);
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const retrieveImageUrl = async (req, res, next) => {
  try {
    const key = req.body.keys;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key.document,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const document = url.split("?")[0];
    // res.status(200).json({
    //   status: "success",
    //   url,
    // });

    req.body.s3Keys = { document };
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
