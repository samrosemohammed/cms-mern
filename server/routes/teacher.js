import express from "express";
import {
  createTeacher,
  getTeachers,
  editTeacher,
  deleteTeacher,
  getSubmitWork,
} from "../controllers/teacherController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post(
  "/admin-dashboard/teacher",
  authMiddleware,
  upload.single("teacherImage"),
  createTeacher
);
router.get("/admin-dashboard/teacher", authMiddleware, getTeachers);
router.put(
  "/admin-dashboard/teacher/:id",
  authMiddleware,
  upload.single("teacherImage"),
  editTeacher
);
router.delete("/admin-dashboard/teacher/:id", authMiddleware, deleteTeacher);
router.get(
  "/teacher-dashboard/module/submit-work/:id/:group",
  authMiddleware,
  getSubmitWork
);
export default router;
