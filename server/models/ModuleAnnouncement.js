import mongoose from "mongoose";

const ModuleAnnouncementSchema = new mongoose.Schema({
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

const ModuleAnnouncement = mongoose.model(
  "module_announcements",
  ModuleAnnouncementSchema
);

export default ModuleAnnouncement;
