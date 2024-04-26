import express from "express";
const router = express.Router();
import {
    ShowUserHousing,
    CreateHousing,
    DeleteHousing,
    ShowAllHousing,
} from "../controllers/HousingController.js";
import jwtValidation from "../middlewares/AuthMiddleware.js";



router.post("/", jwtValidation, CreateHousing);
router.get("/", jwtValidation, ShowAllHousing);
router.get("/:housingId",jwtValidation, ShowUserHousing);
router.delete("/:housingId", jwtValidation, DeleteHousing);

export default router;