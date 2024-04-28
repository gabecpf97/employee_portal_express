import express from "express";
import applicationController from "../controllers/ApplicationController.js";
import applicationValidator from "../middlewares/ApplicationMiddleWare.js";
import inputValidaton from "../middlewares/inputMiddleware.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";
import {
  convertFormDataToJson,
  saveToAWS,
  uploadImageToMulter,
} from "../middlewares/AWSMiddleware.js";
const applicationRouter = express.Router();

applicationRouter.get(
  "/filter",
  jwtValidation,
  restrictToHR,
  applicationController.application_status
);

applicationRouter.get("/:id", applicationController.application_get);
// need token auth
applicationRouter.post(
  "/create",
  uploadImageToMulter,
  saveToAWS,
  convertFormDataToJson,
  inputValidaton.applicationFieldValidation,
  applicationValidator,
  applicationController.application_create
);

applicationRouter.put(
  "/update/:id",
  inputValidaton.applicationFieldValidation,
  applicationValidator,
  applicationController.application_update
);
// need a middleware for checking isHR
applicationRouter.put(
  "/hr/update/:id",
  applicationController.application_hr_update
);

export default applicationRouter;
