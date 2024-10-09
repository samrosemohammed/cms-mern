import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import { StudentSideBar } from "../components/Student/StudentSideBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  useEffect(() => {
    if (!token) {
      alert("Token expired, Please login again");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleMenu = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  return (
    <>
      <StudentSideBar
        isSidebarVisible={isSidebarVisible}
        setSidebarVisible={setSidebarVisible}
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
