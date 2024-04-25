import express from "express";
const router = express.Router();
import {
    createHousing,
} from "../controllers/RegistrationController.js";
// import { login } from "../controllers/LoginController.js";
// import { createUserValidation } from "../middlewares/RegistrationMiddleware.js";


router.post("/", createHousing);

export default router;