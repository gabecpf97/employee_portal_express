import express from "express";
const router = express.Router();
import {
  ShowUserHousing,
  CreateHousing,
  DeleteHousing,
  ShowAllHousing,
  GetUserName
} from "../controllers/HousingController.js";
import { jwtValidation , restrictToHR} from "../middlewares/AuthMiddleware.js";
import {
    CreateFacilityReport,
    ShowUserFacilityReports,
    GetSingleFacilityReport,
    PostCommentToReport,
    GetSingleFacilityComments,
    UpdateReportStatus
    
} from "../controllers/FacilityReportController.js";


//HousingController
router.post("/", jwtValidation, restrictToHR, CreateHousing);
router.get("/:housingId", jwtValidation, ShowUserHousing);
router.get("/", jwtValidation, restrictToHR, ShowAllHousing);
router.delete("/:housingId", jwtValidation, restrictToHR, DeleteHousing);

//FacilitiesController
router.post("/reports", jwtValidation, CreateFacilityReport);
router.get("/reports/all", jwtValidation, ShowUserFacilityReports); //not in use
router.get("/reports/:reportId", jwtValidation, GetSingleFacilityReport);
router.post("/reports/:reportId/comments", jwtValidation, PostCommentToReport )
router.get("/reports/:reportId/comments", jwtValidation, GetSingleFacilityComments ) //not in use
router.post("/reports/getUserInfo", jwtValidation, GetUserName)
router.post("/reports/updateStatus", jwtValidation, UpdateReportStatus)


export default router;
