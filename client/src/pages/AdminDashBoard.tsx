import { Outlet } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { AdminHeader } from "../components/AdminHeader";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const AdminDashBoard = () => {
  const navItems = [
    "Dashboard",
    "Module",
    "Student",
    "Teacher",
    "Assign",
    "Log Out",
  ];

  const navigate = useNavigate();
  const token = Cookies.get("token");
  useEffect(() => {
    if (!token) {
      alert("Token expired, Please login again");
      navigate("/login");
    }
  }, [token, navigate]);

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
