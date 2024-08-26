import express from "express";
import {
  getModuleAssign,
  getModuleAssignment,
  getModuleResources,
  getModuleAnnouncements,
} from "../controllers/userStudentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { downloadResourceFile } from "../controllers/moduleResourceController.js";

const router = express.Router();
router.get(
  "/student-dashboard/:group/:adminID",
  authMiddleware,
  getModuleAssign
);
router.get(
  "/student-dashboard/module/file/:id",
  authMiddleware,
  getModuleResources
);

router.get(
  "/student-dashboard/module/assignment/:id",
  authMiddleware,
  getModuleAssignment
);

router.get(
  "/student-dashboard/module/announcement/:id",
  authMiddleware,
  getModuleAnnouncements
);

router.get(
  "/student-dashboard/module/assignment/uploads/:filename",
  authMiddleware,
  downloadResourceFile
);
router.get(
  "/student-dashboard/module/file/uploads/:filename",
  authMiddleware,
  downloadResourceFile
);

export default router;
