import express from "express";
import optController from "../controllers/OPTController.js";
const optRequestRouter = express.Router();

optRequestRouter.put("/update/:id", optController.optrequest_update_doc);
optRequestRouter.get("/hr/get/:id", optController.optrequest_get_hr);

export default optRequestRouter;
