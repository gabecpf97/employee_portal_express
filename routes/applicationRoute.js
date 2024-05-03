import express from "express";
import applicationController from "../controllers/ApplicationController.js";
import applicationValidator from "../middlewares/ApplicationMiddleWare.js";
import inputValidaton from "../middlewares/inputMiddleware.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";
import {
  convertFormDataToJson,
  retrieveImageUrl,
  saveToAWS,
  uploadImageToMulterSafe,
} from "../middlewares/AWSMiddleware.js";
const applicationRouter = express.Router();

applicationRouter.get(
  "/filter",
  jwtValidation,
  restrictToHR,
  applicationController.application_status
);

applicationRouter.get(
  "/search",
  jwtValidation,
  restrictToHR,
  applicationController.application_filter
);

applicationRouter.get(
  "/getMy",
  jwtValidation,
  applicationController.application_getMy
);

applicationRouter.get(
  "/:id",
  jwtValidation,
  applicationController.application_get
);

// need token auth
applicationRouter.post(
  "/create",
  jwtValidation, //id and username will be added
  uploadImageToMulterSafe,
  saveToAWS,
  retrieveImageUrl,
  convertFormDataToJson,
  inputValidaton.applicationFieldValidation,
  applicationValidator,
  applicationController.application_create
);

applicationRouter.put(
  "/update/:id",
  jwtValidation,
  uploadImageToMulterSafe,
  saveToAWS,
  retrieveImageUrl,
  convertFormDataToJson,
  inputValidaton.applicationFieldValidation,
  applicationValidator,
  applicationController.application_update
);
// need a middleware for checking isHR
applicationRouter.put(
  "/hr/update/:id",
  jwtValidation,
  restrictToHR,
  applicationController.application_hr_update
);

applicationRouter.get(
  "/hr/all",
  jwtValidation,
  restrictToHR,
  applicationController.application_get_all
);

export default applicationRouter;
