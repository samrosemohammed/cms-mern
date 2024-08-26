import express from "express";
import {
  createStudent,
  getStudents,
  editStudent,
  deleteStudent,
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
router.delete("/admin-dashboard/student/:id", authMiddleware, deleteStudent);

export default router;
