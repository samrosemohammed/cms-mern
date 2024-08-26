import mongoose from "mongoose";
import ModuleAssign from "./ModuleAssign.js";

const TeacherSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  teacherID: { type: String, required: true },
  teacherEmail: { type: String, required: true },
  teacherPassword: { type: String, required: true },
  teacherCourse: { type: String, required: true },
  teacherMobileNo: { type: String, required: true },
  teacherImage: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin_users",
    required: true,
  },
});

// Pre-save hook to update related ModuleAssign documents
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("teacherName")) {
    return next();
  }

  try {
    // Update teacherName in ModuleAssign documents
    await ModuleAssign.updateMany(
      { teacherId: this._id },
      {
        $set: {
          teacherName: this.teacherName,
        },
      }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Teacher = mongoose.model("teachers", TeacherSchema);

export default Teacher;
