import { Outlet } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { AdminHeader } from "../components/AdminHeader";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const AdminDashBoard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const navItems = [
    "Dashboard",
    "Module",
    "Student",
    "Teacher",
    "Assign",
    "Log Out",
  ];

  // Handle Sidebar Toggle
  const handleMenu = () => {
    setSidebarVisible(!isSidebarVisible);
  };

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
      <SideBar
        isSidebarVisible={isSidebarVisible}
        setSidebarVisible={setSidebarVisible}
        type="Admin"
        navList={navItems}
        role="admin"
      />

      {isSidebarVisible && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950 bg-opacity-50 z-[996]"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      <div
        className={`main-content-dashboard ${
          isSidebarVisible ? "md:ml-[22%]" : "ml-0 pl-4"
        } pr-4 pb-4`}
      >
        <AdminHeader handleMenu={handleMenu} />
        <Outlet />
      </div>
    </>
  );
};
