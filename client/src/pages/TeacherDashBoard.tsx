import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import { TeacherSideBar } from "../components/Teacher/TeacherSideBar";
export const TeacherDashBoard = () => {
  return (
    <>
      <TeacherSideBar />
      <div className="main-content-dashboard ml-[22%] pr-4 pb-4">
        <AdminHeader />
        <Outlet />
      </div>
    </>
  );
};
