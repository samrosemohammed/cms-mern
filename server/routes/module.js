import express from "express";
import {
  createModule,
  getModules,
  editModule,
  deleteModule,
} from "../controllers/moduleController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin-dashboard/module", authMiddleware, createModule);
router.get("/admin-dashboard/module", authMiddleware, getModules);
router.put("/admin-dashboard/module/:id", authMiddleware, editModule);
router.delete("/admin-dashboard/module/:id", authMiddleware, deleteModule);

export default router;
