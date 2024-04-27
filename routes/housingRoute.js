import express from "express";
const router = express.Router();
import {
  ShowUserHousing,
  CreateHousing,
  DeleteHousing,
  ShowAllHousing,
} from "../controllers/HousingController.js";
import { jwtValidation } from "../middlewares/AuthMiddleware.js";
import {
    CreateFacilityReport,
    ShowUserFacilityReports,
    GetSingleFacilityReport,
    PostCommentToReport,
    GetSingleFacilityComments,
} from "../controllers/FacilityReportController.js";


//HousingController
router.post("/", jwtValidation, CreateHousing);
router.get("/", jwtValidation, ShowAllHousing);
router.get("/:housingId", jwtValidation, ShowUserHousing);
router.delete("/:housingId", jwtValidation, DeleteHousing);

//FacilitiesController
router.post("/reports", jwtValidation, CreateFacilityReport);
router.get("/reports/all", jwtValidation, ShowUserFacilityReports);
router.get("/reports/:reportId", jwtValidation, GetSingleFacilityReport);
router.post("/reports/:reportId/comments", jwtValidation, PostCommentToReport )
router.get("/reports/:reportId/comments", jwtValidation, GetSingleFacilityComments )


export default router;
