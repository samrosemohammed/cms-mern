import express from "express";
import { updatePasswordChange } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put(
  "/admin-dashboard/settings/change-password/:id",
  authMiddleware,
  updatePasswordChange
);

export default router;
