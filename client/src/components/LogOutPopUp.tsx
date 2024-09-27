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
          className={`max-w-[850px] bg-slate-800 p-2 rounded-lg relative`}
        >
          <form className={`p-2 space-y-4`} action="">
            <div className="flex items-center justify-between">
              <div></div>
              <button type="button" onClick={handleCancel}>
                <X className="hover:bg-slate-700 text-slate-300" size={28} />
              </button>
            </div>
            <div className="text-[18px]">
              <p className="text-slate-300">
                Are you sure you want to log out ?
              </p>
            </div>
            <div></div>
            <div className="flex justify-between text-[18px]">
              <div></div>
              <div className="space-x-1.5">
                <button
                  className="text-[16px] cursor-pointer rounded px-2 py-0.5 text-slate-300 hover:bg-slate-700"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="text-[16px] cursor-pointer rounded px-2 py-0.5 text-red-400  hover:bg-slate-700"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
