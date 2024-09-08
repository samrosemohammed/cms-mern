import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import { StudentSideBar } from "../components/Student/StudentSideBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const StudentDashboard = () => {
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
      <StudentSideBar />
      <div className="main-content-dashboard ml-[22%] pr-4 pb-4">
        <AdminHeader />
        <Outlet />
      </div>
    </>
  );
};
