import express from "express";
import {
  createModuleAnnouncement,
  getModuleAnnouncements,
  deleteFile,
  editModuleAnnouncement,
  deleteModuleAnnouncement,
} from "../controllers/moduleAnnouncementController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { downloadResourceFile } from "../controllers/moduleResourceController.js";

const router = express.Router();

router.post(
  "/teacher-dashboard/module/announcement/create",
  authMiddleware,
  upload.array("files"),
  createModuleAnnouncement
);

router.get(
  "/teacher-dashboard/module/announcement/:id/:group",
  authMiddleware,
  getModuleAnnouncements
);

router.get(
  "/teacher-dashboard/module/announcement/:id",
  authMiddleware,
  getModuleAnnouncements
);

router.delete(
  "/teacher-dashboard/module/announcement/edit/:id/:fileName",
  authMiddleware,
  deleteFile
);

router.put(
  "/teacher-dashboard/module/announcement/edit/:id",
  authMiddleware,
  upload.array("files"),
  editModuleAnnouncement
);

router.delete(
  "/teacher-dashboard/module/announcement/:id",
  authMiddleware,
  deleteModuleAnnouncement
);

router.get(
  "/teacher-dashboard/module/announcement/download/uploads/:filename",
  authMiddleware,
  downloadResourceFile
);

export default router;
