import express from "express";
import {
  createModuleAssignment,
  deleteAssignment,
  deleteFile,
  editModuleAssignment,
  getModuleAssignments,
} from "../controllers/moduleAssignmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { downloadResourceFile } from "../controllers/moduleResourceController.js";

const router = express.Router();
router.post(
  "/teacher-dashboard/module/assignment/create",
  authMiddleware,
  upload.array("files"),
  createModuleAssignment
);
router.put(
  "/teacher-dashboard/module/assignment/edit/:id",
  authMiddleware,
  upload.array("files"),
  editModuleAssignment
);
router.get(
  "/teacher-dashboard/module/assignment/:id/:group",
  authMiddleware,
  getModuleAssignments
);
router.get(
  "/teacher-dashboard/module/assignment/download/uploads/:filename",
  authMiddleware,
  downloadResourceFile
);
router.get(
  "/teacher-dashboard/module/assignment/edit/:id",
  authMiddleware,
  getModuleAssignments
);
router.delete(
  "/teacher-dashboard/module/assignment/edit/:id/:fileName",
  authMiddleware,
  deleteFile
);
router.delete(
  "/teacher-dashboard/module/assignment/:id",
  authMiddleware,
  deleteAssignment
);
export default router;
