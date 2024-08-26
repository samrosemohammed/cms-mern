import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentID: { type: String, required: true, unique: true },
  studentEmail: { type: String, required: true, unique: true },
  studentPassword: { type: String, required: true },
  studentCourseSelected: { type: String, required: true },
  studentGroup: { type: String, required: true },
  studentMobileNo: { type: String, required: true, unique: true },
  studentStartYear: { type: Date, required: true },
  studentEndYear: { type: Date, required: true },
  studentImage: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin_users",
    required: true,
  }, // user id of the user who created the student
});

const student = mongoose.model("students", StudentSchema);
export default student;
