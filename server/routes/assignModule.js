import express from "express";
import {
  createModuleAssign,
  getModuleAssign,
  deleteModuleAssign,
  editModuleAssign,
  getStudentByGroup,
} from "../controllers/assignModule.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post(
  "/admin-dashboard/module/assign-module",
  authMiddleware,
  createModuleAssign
);
router.get(
  "/admin-dashboard/module/assign-module",
  authMiddleware,
  getModuleAssign
);
router.get("/teacher-dashboard", authMiddleware, getModuleAssign);

router.put("/admin-dashboard/assign/:id", authMiddleware, editModuleAssign);
router.delete(
  "/admin-dashboard/module/assign-module/:id",
  authMiddleware,
  deleteModuleAssign
);

router.get("/admin-dashboard/assign/:group", authMiddleware, getStudentByGroup);
export default router;
