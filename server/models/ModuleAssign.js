import mongoose from "mongoose";

const ModuleAssignSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  assignGroup: { type: String, required: true },
  moduleID: { type: String, require: true },
  moduleName: { type: String, required: true },
  moduleCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "modules",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers",
    required: true,
  },
  dateAssigned: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin_users",
    required: true,
  },
});

const ModuleAssign = mongoose.model("module_assign", ModuleAssignSchema);

export default ModuleAssign;
