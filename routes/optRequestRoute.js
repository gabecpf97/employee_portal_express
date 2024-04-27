import express from "express";
import optController from "../controllers/OPTRequestController.js";
import optRequestValidator from "../middlewares/OPTRequestMiddleware.js";
import inputValidaton from "../middlewares/inputMiddleware.js";
const optRequestRouter = express.Router();

optRequestRouter.get("/", optController.optrequest_get_all);
optRequestRouter.get("/in-process", optController.optrequest_get_inProgress);
optRequestRouter.get("/:id", optController.optrequest_get_id);
optRequestRouter.put(
  "/:id",
  inputValidaton.bodyInputValid,
  optRequestValidator.step_validator,
  optController.optrequest_update_doc
);
optRequestRouter.put(
  "/:id/action",
  inputValidaton.bodyInputValid,
  optRequestValidator.hr_action_validator,
  optController.optrequest_hr_action
);
optRequestRouter.post(
  "/:id/notification",
  optController.optrequest_hr_send_noti
);

export default optRequestRouter;
