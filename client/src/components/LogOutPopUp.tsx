import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
export const LogOutPopUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleCancel = () => {
    if (location.pathname.includes("admin-dashboard")) {
      navigate("/admin-dashboard");
    } else if (location.pathname.includes("teacher-dashboard")) {
      navigate("/teacher-dashboard");
    } else if (location.pathname.includes("student-dashboard")) {
      navigate("/student-dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.log("logout Failed", err);
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-50">
        <section
          className={`"max-w-[850px]" bg-slate-800 p-4 rounded relative`}
        >
          <form className={`bg-slate-800 p-4 space-y-6`} action="">
            <div className="flex items-center justify-between">
              <div></div>
              <button type="button" onClick={handleCancel}>
                <X size={28} />
              </button>
            </div>
            <div className="text-[24px] text-slate-400">
              <p>Are you sure you want to log out ?</p>
            </div>
            <div></div>
            <div className="flex gap-4 text-[18px]">
              <button
                className="cursor-pointer w-full rounded px-2 py-1 bg-red-700 hover:bg-red-800"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer w-full rounded px-2 py-1 bg-green-700 hover:bg-green-800"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
