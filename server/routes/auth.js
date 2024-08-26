import express from "express";
import loginUser, {
  getUserDetails,
  updateUser,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logout successful" });
});
router.get("/user-details", authMiddleware, getUserDetails);

router.put(
  "/user-details/:id",
  authMiddleware,
  upload.single("adminImage"),
  updateUser
);

export default router;
