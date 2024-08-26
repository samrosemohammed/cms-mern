import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createSubmitAssignment,
  getSubmitAssignments,
  deleteFile,
  editSubmittedAssignments,
  deleteSubmitAssignment,
} from "../controllers/submitAssignment.js";

const router = express.Router();

router.post(
  "/student-dashboard/module/assignment/submit-work",
  authMiddleware,
  upload.array("files"),
  createSubmitAssignment
);

router.get(
  "/student-dashboard/module/assignment/submit-work/:id",
  authMiddleware,
  getSubmitAssignments
);

router.delete(
  "/student-dashboard/module/assignment/submit-work/resubmit/:id/:fileName",
  authMiddleware,
  deleteFile
);

router.put(
  "/student-dashboard/module/assignment/submit-work/resubmit/:id",
  authMiddleware,
  upload.array("files"),
  editSubmittedAssignments
);

router.delete(
  "/student-dashboard/module/assignment/delete-submit-work/:id",
  authMiddleware,
  deleteSubmitAssignment
);
export default router;
