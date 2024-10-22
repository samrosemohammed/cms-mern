import { CircleUser, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../utlis/ThemeContext";

interface ProfileDropDownProps {
  setIsProfileIconClick: (value: boolean) => void;
}

export const ProfileDropDown = ({
  setIsProfileIconClick,
}: ProfileDropDownProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleMyProfile = (e: any) => {
    e.preventDefault();
    navigate("/student-dashboard/settings");
    setIsProfileIconClick(false); // Close the dropdown after logout
  };

  const handleLogOut = (e: any) => {
    e.preventDefault();
    navigate("/student-dashboard/logout");
    setIsProfileIconClick(false);
  };

  return (
    <>
      <section
        className={`${
          theme === "dark" ? "bg-slate-800" : "bg-white"
        } text-[16px] absolute right-3 -bottom-[100px] shadow-lg rounded-md p-2`}
      >
        <ul className="space-y-2">
          <li
            className={`${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } p-2 rounded-md`}
          >
            <a
              onClick={handleMyProfile}
              className="flex items-center gap-2"
              href=""
            >
              <CircleUser size={24} className="inline-block" />
              My Profile
            </a>
          </li>
          <li
            className={`${
              theme === "dark" ? "hover:bg-red-600" : "hover:bg-red-100"
            } p-2 rounded-md`}
          >
            <a
              onClick={handleLogOut}
              className={`${
                theme === "dark" ? "text-white" : "text-red-600"
              } flex items-center gap-2`}
              href=""
            >
              <LogOut />
              Log Out
            </a>
          </li>
        </ul>
      </section>
    </>
  );
};
