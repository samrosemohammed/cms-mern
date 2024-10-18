import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import { TeacherSideBar } from "../components/Teacher/TeacherSideBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTheme } from "../utlis/ThemeContext";

export const TeacherDashBoard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const token = Cookies.get("token");
  useEffect(() => {
    if (!token) {
      alert("Token expired, Please login again");
      navigate("/login");
    }
  }, [token, navigate]);
  // Handle Sidebar Toggle
  const handleMenu = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <TeacherSideBar
        isSidebarVisible={isSidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />
      {isSidebarVisible && (
        <div
          className={`${
            theme === "dark" ? "bg-slate-950 " : "bg-[#00000055]"
          } md:hidden fixed inset-0 bg-opacity-50 z-[996]`}
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
