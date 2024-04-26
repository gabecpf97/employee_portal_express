import express from "express";
import optController from "../controllers/OPTRequestController.js";
import optRequestValidator from "../middlewares/OPTRequestMiddleware.js";
const optRequestRouter = express.Router();

optRequestRouter.get("/", optController.optrequest_get_all);
optRequestRouter.get("/in-process", optController.optrequest_get_inProgress);
optRequestRouter.get("/:id", optController.optrequest_get_id);
optRequestRouter.put(
  "/:id",
  optRequestValidator,
  optController.optrequest_update_doc
);
optRequestRouter.put("/:id/action", optController.optrequest_hr_action);

export default optRequestRouter;
