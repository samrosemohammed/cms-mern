import express from "express";
import {
  createStudent,
  getStudents,
  editStudent,
  deleteStudent,
  removeImage,
  updateChangeEmail,
  updatePasswordChange,
  updateStudentProfile,
} from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post(
  "/admin-dashboard/student",
  authMiddleware,
  upload.single("studentImage"),
  createStudent
);
// routes/student.js
router.get("/admin-dashboard/student", authMiddleware, getStudents);
router.put(
  "/admin-dashboard/student/:id",
  authMiddleware,
  upload.single("studentImage"),
  editStudent
);

router.put(
  "/student-dashboard/settings/change-email/:id",
  authMiddleware,
  updateChangeEmail
);

router.put(
  "/student-dashboard/settings/change-password/:id",
  authMiddleware,
  updatePasswordChange
);

router.put(
  "/student-dashboard/settings/profile/:id",
  authMiddleware,
  upload.single("studentImage"),
  updateStudentProfile
);

router.delete("/admin-dashboard/student/:id", authMiddleware, deleteStudent);

router.delete(
  "/student-dashboard/settings/remove-img/:id",
  authMiddleware,
  removeImage
);
export default router;
