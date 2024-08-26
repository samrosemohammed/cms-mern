import mongoose from "mongoose";

const moduleResourceSchema = new mongoose.Schema({
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

const ModuleResource = mongoose.model("module_resources", moduleResourceSchema);

export default ModuleResource;
