import express from "express";
import {
  createModuleResource,
  deleteFile,
  deleteModuleResource,
  downloadResourceFile,
  editModuleResource,
  getModuleResources,
} from "../controllers/moduleResourceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/teacher-dashboard/module/file/upload",
  authMiddleware,
  upload.array("files"),
  createModuleResource
);

router.get(
  "/teacher-dashboard/module/file/:id/:group",
  authMiddleware,
  getModuleResources
);

router.get(
  "/teacher-dashboard/module/file/download/uploads/:filename",
  authMiddleware,
  downloadResourceFile
);

router.get(
  "/teacher-dashboard/module/file/edit/:id",
  authMiddleware,
  getModuleResources
);

router.put(
  "/teacher-dashboard/module/file/edit/:id",
  authMiddleware,
  upload.array("files"),
  editModuleResource
);

router.delete(
  "/teacher-dashboard/module/file/:id",
  authMiddleware,
  deleteModuleResource
);

router.delete(
  "/teacher-dashboard/module/file/edit/:id/:fileName",
  authMiddleware,
  deleteFile
);
export default router;
