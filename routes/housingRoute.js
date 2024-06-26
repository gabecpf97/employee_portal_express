import express from "express";
const router = express.Router();
import {
  ShowUserHousing,
  CreateHousing,
  DeleteHousing,
  ShowAllHousing,
  GetUserName,
  GetApplicationInfo,
  ShowUserHousingHR
} from "../controllers/HousingController.js";
import { jwtValidation, restrictToHR } from "../middlewares/AuthMiddleware.js";
import {
  CreateFacilityReport,
  ShowUserFacilityReports,
  GetSingleFacilityReport,
  PostCommentToReport,
  GetSingleFacilityComments,
  UpdateReportStatus,
  UpdateComment,
  addCommentHR
} from "../controllers/FacilityReportController.js";

//HousingController
router.post("/", jwtValidation, restrictToHR, CreateHousing);
router.get("/:housingId", jwtValidation, ShowUserHousing);
router.get("/hr/:housingId", jwtValidation, ShowUserHousingHR);
router.get("/", jwtValidation, restrictToHR, ShowAllHousing);
router.delete("/:housingId", jwtValidation, restrictToHR, DeleteHousing);

//FacilitiesController
router.post("/reports", jwtValidation, CreateFacilityReport);
router.get("/reports/all", jwtValidation, ShowUserFacilityReports); //not in use
router.get("/reports/:reportId", jwtValidation, GetSingleFacilityReport);
router.post("/reports/:reportId/comments", jwtValidation, PostCommentToReport);
router.post("/reports/hr/:reportId/comments", jwtValidation,   addCommentHR);
router.get(
  "/reports/:reportId/comments",
  jwtValidation,
  GetSingleFacilityComments
); //not in use
router.post("/reports/getUserInfo", jwtValidation, GetUserName);
router.post("/reports/updateStatus", jwtValidation, UpdateReportStatus);
router.get(
  "/getApplicationInfo/:userIdFront",
  jwtValidation,
  GetApplicationInfo
);
router.post("/comments/updateComment", jwtValidation, UpdateComment);

export default router;
