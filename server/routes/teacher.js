import express from "express";
import {
  createTeacher,
  getTeachers,
  editTeacher,
  deleteTeacher,
  getSubmitWork,
  updateChangeEmail,
  updatePasswordChange,
  updateTeacherProfile,
  removeImage,
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

router.put(
  "/teacher-dashboard/settings/change-email/:id",
  authMiddleware,
  updateChangeEmail
);

router.put(
  "/teacher-dashboard/settings/change-password/:id",
  authMiddleware,
  updatePasswordChange
);

router.put(
  "/teacher-dashboard/settings/profile/:id",
  authMiddleware,
  upload.single("teacherImage"),
  updateTeacherProfile
);

router.delete(
  "/teacher-dashboard/settings/remove-img/:id",
  authMiddleware,
  removeImage
);
export default router;
