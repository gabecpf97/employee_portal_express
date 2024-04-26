import express from "express";
import optController from "../controllers/OPTRequestController.js";
import optRequestValidator from "../middlewares/OPTRequestMiddleware.js";
const optRequestRouter = express.Router();

optRequestRouter.put(
  "/update/:id",
  optRequestValidator,
  optController.optrequest_update_doc
);
optRequestRouter.get("/hr/get/:id", optController.optrequest_get_hr);

export default optRequestRouter;
