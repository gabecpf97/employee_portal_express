import express from "express";
import applicationController from "../controllers/applicationController.js";
import applicationValidator from "../middlewares/ApplicationMiddleWare.js";
import inputValidaton from "../middlewares/inputMiddleware.js";
const applicationRouter = express.Router();

applicationRouter.get("/:id", applicationController.application_get);
// need token auth
applicationRouter.post(
  "/create",
  inputValidaton.applicationFieldValidation,
  applicationValidator,
  applicationController.application_create
);

applicationRouter.put("/update", applicationController.application_update);

applicationRouter.put(
  "/hr/update",
  applicationController.application_hr_update
);

export default applicationRouter;
