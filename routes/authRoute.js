import express from "express";
const router = express.Router();
import {
  RegisterPageController
} from "../controllers/RegistrationController.js";
import { login } from "../controllers/LoginController.js";
import { createUserValidation } from "../middlewares/RegistrationMiddleware.js";

router.post("/signup", createUserValidation, RegisterPageController);
router.post("/login", login);

export default router;