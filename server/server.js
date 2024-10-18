import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import http from "http";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import cookieParser from "cookie-parser";
import teacherRoutes from "./routes/teacher.js";
import moduleRoutes from "./routes/module.js";
import adminRoutes from "./routes/admin.js";
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
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Socket.io
export const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// const connectedClients = {};
io.on("connection", (socket) => {
  console.log("Socket io connected: ", socket.id);
  // connectedClients[socket.id] = socket;
  socket.on("disconnect", () => {
    console.log("Socket io disconnected");
  });
});

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
app.use("/api", adminRoutes);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
