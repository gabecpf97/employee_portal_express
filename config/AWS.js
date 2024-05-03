import multer from "multer";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
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
  console.log("in multerFilter");
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

const uploadOPTImageToMulter = upload.fields([
  { name: "document", maxCount: 1 },
]);

const uploadImageToAWS = async (fileName, imageData) => {
  try {
    const paramsForUpload = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: imageData.buffer,
      ContentType: imageData.mimetype,
    };
    await S3.send(new PutObjectCommand(paramsForUpload));

    const paramsForRetrieve = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
    };

    const command = new GetObjectCommand(paramsForRetrieve);

    const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    throw new Error("Upload image to AWS failed!");
  }
};

export { S3, uploadImageToMulter, uploadOPTImageToMulter, uploadImageToAWS };
