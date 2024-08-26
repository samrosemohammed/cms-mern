import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import cookieParser from "cookie-parser";
import teacherRoutes from "./routes/teacher.js";
import moduleRoutes from "./routes/module.js";
import assignModuleRoutes from "./routes/assignModule.js";
import path from "path";
import { fileURLToPath } from "url";
import moduleResourceRoutes from "./routes/moduleResource.js";
import assignmentRoutes from "./routes/moduleAssignment.js";
import announcementRoutes from "./routes/moduleAnnouncement.js";
import userStudentRoutes from "./routes/userStudent.js";
import submitAssignmentRoutes from "./routes/submitAssignment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// FOR LOGIN ROUTES
app.use("/api/auth", authRoutes);

app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", moduleRoutes);
app.use("/api", assignModuleRoutes);
app.use("/api", moduleResourceRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", announcementRoutes);
app.use("/api", userStudentRoutes);
app.use("/api", submitAssignmentRoutes);
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   const login = await User.findOne({ email });
//   console.log(login);
//   if (!login) {
//     return res.status(400).json({ message: "User not found" });
//   }
//   console.log(password);
//   console.log(login.password);

//   // for checking password
//   if (password != login.password) {
//     return res.status(400).json({ message: "Password is incorrect" });
//   }

//   return res
//     .status(200)
//     .json({ success: true, message: "Login successful", user: login });
// });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
