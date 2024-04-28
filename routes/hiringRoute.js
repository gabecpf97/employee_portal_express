import express from "express";
const router = express.Router();
import { sendHiringLink, getHiringRecords } from "../controllers/HiringController.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";

router.get("/", jwtValidation, restrictToHR, getHiringRecords);
router.post("/", jwtValidation, restrictToHR, sendHiringLink);

export default router;