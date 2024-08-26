import mongoose from "mongoose";

const ModuleAssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  files: {
    type: Array,
  },
  links: {
    type: Array,
  },
  DueDate: {
    type: String,
  },
  DueDateTime: {
    type: String,
  },

  assignGroup: {
    type: String,
  },

  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "modules",
    // required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers",
    // required: true,
  },

  createdAt: {
    type: Date,
    deafult: Date.now,
  },
});

const ModuleAssignment = mongoose.model(
  "module_assignments",
  ModuleAssignmentSchema
);
export default ModuleAssignment;
