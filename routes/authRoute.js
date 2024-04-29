import express from "express";
const router = express.Router();
import { RegisterPageController , CheckRegistrationToken } from "../controllers/RegistrationController.js";
import { login } from "../controllers/LoginController.js";
import { createUserValidation } from "../middlewares/RegistrationMiddleware.js";
import { jwtValidation} from "../middlewares/AuthMiddleware.js";

router.post("/signup", createUserValidation, RegisterPageController);
router.post("/login", login);
router.post("/registrationValidation", CheckRegistrationToken)

export default router;