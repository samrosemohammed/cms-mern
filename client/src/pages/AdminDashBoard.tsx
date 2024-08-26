import { Outlet } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { AdminHeader } from "../components/AdminHeader";

export const AdminDashBoard = () => {
  const navItems = [
    "Dashboard",
    "Module",
    "Student",
    "Teacher",
    "Assign",
    "Log Out",
  ];

  return (
    <>
      <SideBar type="Admin" navList={navItems} role="admin" />
      <div className="main-content-dashboard ml-[22%] pr-4 pb-4">
        <AdminHeader />

        <Outlet />
      </div>
    </>
  );
};
