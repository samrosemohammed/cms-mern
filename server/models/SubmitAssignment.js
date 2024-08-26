import mongoose from "mongoose";

const SubmitAssignmentSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "module_assignments",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "modules",
  },
  assignGroup: {
    type: String,
  },
  files: {
    type: Array,
    required: true,
  },
  links: {
    type: Array,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
});

const SubmitAssignment = mongoose.model(
  "submit_assignments",
  SubmitAssignmentSchema
);
export default SubmitAssignment;
