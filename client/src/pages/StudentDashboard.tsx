import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import { StudentSideBar } from "../components/Student/StudentSideBar";

export const StudentDashboard = () => {
  return (
    <>
      <StudentSideBar />
      <div className="main-content-dashboard ml-[22%] pr-4 pb-4">
        <AdminHeader />
        <Outlet />
      </div>
    </>
  );
};
