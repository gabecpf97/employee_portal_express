import express from "express";
import optController from "../controllers/OPTRequestController.js";
import optRequestValidator from "../middlewares/OPTRequestMiddleware.js";
import inputValidaton from "../middlewares/inputMiddleware.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";
import {
  convertFormDataToJson,
  saveToAWS,
  uploadImageToMulterSafe,
} from "../middlewares/AWSOPTMiddleware.js";
const optRequestRouter = express.Router();

optRequestRouter.get(
  "/getRequestId",
  jwtValidation,
  optController.get_optId_by_applicationId
);

optRequestRouter.get(
  "/",
  jwtValidation,
  restrictToHR,
  optController.optrequest_get_all
);
optRequestRouter.get(
  "/in-process",
  jwtValidation,
  restrictToHR,
  optController.optrequest_get_inProgress
);
optRequestRouter.get("/:id", jwtValidation, optController.optrequest_get_id);

// optRequestRouter.put(
//   "/:id",
//   jwtValidation,
//   inputValidaton.bodyInputValid,
//   optRequestValidator.step_validator,
//   optController.optrequest_update_doc
// );

optRequestRouter.put(
  "/:id",
  jwtValidation,
  uploadImageToMulterSafe,
  saveToAWS,
  convertFormDataToJson,
  inputValidaton.bodyInputValid,
  optController.optrequest_update_doc
);

optRequestRouter.put(
  "/:id/action",
  jwtValidation,
  restrictToHR,
  inputValidaton.bodyInputValid,
  optRequestValidator.hr_action_validator,
  optController.optrequest_hr_action
);
optRequestRouter.post(
  "/:id/notification",
  jwtValidation,
  restrictToHR,
  optController.optrequest_hr_send_noti
);

export default optRequestRouter;
