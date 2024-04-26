import express from "express";
const router = express.Router();
import {
    ShowUserHousing,
    CreateHousing
} from "../controllers/HousingController.js";
import jwtValidation from "../middlewares/AuthMiddleware.js";



router.post("/", CreateHousing);
router.get("/:housingId", ShowUserHousing)

export default router;