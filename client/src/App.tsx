import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { AdminDashBoard } from "./pages/AdminDashBoard";
import { AdminStats } from "./components/AdminStats";
import { AdminModule } from "./components/AdminModule";
import { AdminTeacher } from "./components/AdminTeacher";
import { AdminStudent } from "./components/AdminStudent";
import { AdminAssignModule } from "./components/AdminAssignModule";
import { AuthProvider } from "./utlis/AuthContext";
import { ProtectedRoute } from "./utlis/ProtectedRoute";
import { LogOutPopUp } from "./components/LogOutPopUp";
import { TeacherDashBoard } from "./pages/TeacherDashBoard";
import { TeacherModule } from "./components/Teacher/TeacherModule";
import { TeacherModuleFile } from "./components/Teacher/TeacherModuleFile";
import { ResourceForm } from "./components/Teacher/ResouceForm";
import { TeacherAssignment } from "./components/Teacher/TeacherAssignment";
import { AssignmentForm } from "./components/Teacher/AssignmentForm";
import { TeacherAnnouncement } from "./components/Teacher/TeacherAnnouncement";
import { AnnouncementForm } from "./components/Teacher/AnnouncementForm";
import { SubmitWork } from "./components/Teacher/SubmitWork";
import { StudentDashboard } from "./pages/StudentDashboard";
import { Module } from "./components/Student/Module";
import { File } from "./components/Student/File";
import { Assignment } from "./components/Student/Assignment";
import { Announcement } from "./components/Student/Announcement";
import { SubmitAssignmentForm } from "./components/Student/SubmitAssignmentForm";
import { Settings } from "./components/Teacher/Settings";
import { StudentSettings } from "./components/Student/StudentSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-dashboard",
    element: <ProtectedRoute element={<AdminDashBoard />} />,
    children: [
      {
        index: true, // This sets AdminStats as the default route
        element: <AdminStats />,
      },
      // {
      //   path: "stats",
      //   element: <AdminStats />,
      // },
      {
        path: "module",
        element: <AdminModule />,
      },
      {
        path: "teacher",
        element: <AdminTeacher />,
      },
      {
        path: "student",
        element: <AdminStudent />,
      },
      {
        path: "assign",
        element: <AdminAssignModule />,
      },
      {
        path: "logout",
        element: <LogOutPopUp />,
      },
    ],
  },

  {
    path: "/teacher-dashboard",
    element: <ProtectedRoute element={<TeacherDashBoard />} />,
    children: [
      {
        index: true,
        element: <TeacherModule />,
      },

      {
        path: "module/:id",
        element: <TeacherModuleFile />,
      },

      {
        path: "module/file/upload",
        element: <ResourceForm />,
      },

      {
        path: "module/file/edit/:id",
        element: <ResourceForm />,
      },

      {
        path: "module/assignment/create",
        element: <AssignmentForm />,
      },

      {
        path: "module/assignment/edit/:id",
        element: <AssignmentForm />,
      },

      {
        path: "module/assignment",
        element: <TeacherAssignment />,
      },

      {
        path: "module/announcement",
        element: <TeacherAnnouncement />,
      },

      {
        path: "module/announcement/create",
        element: <AnnouncementForm />,
      },

      {
        path: "module/announcement/edit/:id",
        element: <AnnouncementForm />,
      },

      {
        path: "module/submit-work",
        element: <SubmitWork />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "logout",
        element: <LogOutPopUp />,
      },
    ],
  },

  {
    path: "/student-dashboard",
    element: <ProtectedRoute element={<StudentDashboard />} />,
    children: [
      {
        index: true,
        element: <Module />,
      },

      {
        path: "module/:id",
        element: <File />,
      },

      {
        path: "module/assignment",
        element: <Assignment />,
      },
      {
        path: "module/announcement",
        element: <Announcement />,
      },

      {
        path: "module/assignment/submit-work/:assignmentObjectId",
        element: <SubmitAssignmentForm />,
      },

      {
        path: "module/assignment/submit-work/resubmit/:assignmentObjectId",
        element: <SubmitAssignmentForm />,
      },
      {
        path: "settings",
        element: <StudentSettings />,
      },
      {
        path: "logout",
        element: <LogOutPopUp />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
