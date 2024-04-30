import express from "express";
const router = express.Router();
import { getUserInfo, editUserInfo, getUserStatus } from "../controllers/UserController.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";
import applicationController from "../controllers/ApplicationController.js";

router.get("/status",jwtValidation, getUserStatus)
router.get("/search",jwtValidation,restrictToHR,applicationController.application_filter);
router.get("/:userid", jwtValidation, getUserInfo);
router.put("/:userid", jwtValidation, editUserInfo);
router.get("/", jwtValidation, restrictToHR, applicationController.application_getAll);

export default router;
