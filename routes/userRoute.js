import express from "express";
const router = express.Router();
import {
  getUserInfo, editUserInfo
} from "../controllers/UserController.js";
import jwtValidation from "../middlewares/AuthMiddleware.js";
// import { login } from "../controllers/LoginController.js";
// import { createUserValidation } from "../middlewares/RegistrationMiddleware.js";

router.get("/:userid", jwtValidation, getUserInfo);
router.put("/:userid", jwtValidation, editUserInfo);


//router.post("/auth/login", login);

export default router;
