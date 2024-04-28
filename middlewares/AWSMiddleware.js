import multer from "multer";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Application from "../models/Application.js";

const S3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadImageToMulter = upload.single("image");

const generateFileName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");

const saveToAWS = async (req, res, next) => {
  try {
    const imageName = generateFileName();
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await S3.send(command);
    req.body.imageName = imageName;

    // save image name to the application
    const theApplication = await Application.findById(
      "662aeb4c0b4690ff3dc9f4b2"
    );
    if (!theApplication) {
      return res.status(400).json({
        message: "Application not found!",
      });
    }
    theApplication.workAuthorization.document = imageName;
    await Application.findByIdAndUpdate(
      "662aeb4c0b4690ff3dc9f4b2",
      theApplication
    );
    res.status(200).json({
      status: "success",
      imageName,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const retrieveImageUrl = async (req, res, next) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.imageName,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
    // res.status(200).json({
    //   status: "success",
    //   url,
    // });

    req.body.url = url;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { uploadImageToMulter, saveToAWS, retrieveImageUrl };
