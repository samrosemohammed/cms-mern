import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../utlis/ThemeContext";
export const LogOutPopUp = () => {
  const { theme } = useTheme();
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
      <div
        className={`${
          theme === "dark" ? "bg-slate-900" : "bg-[#00000055]"
        } fixed inset-0 bg-opacity-80 flex items-center justify-center z-[999]`}
      >
        <section
          className={`${
            theme === "dark" ? "bg-slate-800" : "bg-white"
          } max-w-[850px] p-2 rounded-lg relative`}
        >
          <form className={`p-2 space-y-4`} action="">
            <div className="flex items-center justify-between">
              <div></div>
              <button type="button" onClick={handleCancel}>
                <X
                  className={`${
                    theme === "dark"
                      ? "dark:hover:bg-slate-700 dark:text-slate-300"
                      : "hover:bg-gray-100 text-gray-500"
                  } size={28}`}
                />
              </button>
            </div>
            <div className="text-[18px]">
              <p
                className={`${
                  theme === "dark" ? "dark:text-slate-300" : "text-gray-500"
                } `}
              >
                Are you sure you want to log out ?
              </p>
            </div>
            <div></div>
            <div className="flex justify-between text-[18px]">
              <div></div>
              <div className="space-x-1.5">
                <button
                  className={`${
                    theme === "dark"
                      ? "dark:text-slate-300 dark:hover:bg-slate-700"
                      : "hover:bg-gray-100"
                  } text-[16px] cursor-pointer rounded px-2 py-0.5 `}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className={`${
                    theme === "dark"
                      ? "  dark:hover:bg-slate-700"
                      : "hover:bg-red-100"
                  } text-[16px] text-red-400 cursor-pointer rounded px-2 py-0.5 `}
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
