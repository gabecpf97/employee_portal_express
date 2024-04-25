import express from "express";
const router = express.Router();
import {
  RegisterPageController,
  createHousing,
} from "../controllers/RegistrationController.js";
import { login } from "../controllers/LoginController.js";
import { createUserValidation } from "../middlewares/RegistrationMiddleware.js";

router.post("/auth/signup", createUserValidation, RegisterPageController);
router.post("/housing", createHousing);

router.post("/auth/login", login);

export default router;
