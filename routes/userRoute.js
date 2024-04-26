import express from "express";
const router = express.Router();
import { getUserInfo, editUserInfo } from "../controllers/UserController.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";
import applicationController from "../controllers/ApplicationController.js";
// import { login } from "../controllers/LoginController.js";
// import { createUserValidation } from "../middlewares/RegistrationMiddleware.js";

router.get(
  "/search",
  jwtValidation,
  restrictToHR,
  applicationController.application_filter
);

router.get("/:userid", jwtValidation, getUserInfo);
router.put("/:userid", jwtValidation, editUserInfo);

router.get(
  "/",
  jwtValidation,
  restrictToHR,
  applicationController.application_getAll
);

//router.post("/auth/login", login);

export default router;
