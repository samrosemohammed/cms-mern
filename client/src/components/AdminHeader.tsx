import { Bell, Menu, Moon, Sun } from "lucide-react";
import defaultImg from "../assets/default-image.png";
import { useTheme } from "../utlis/ThemeContext";
import { ProfileDropDown } from "./ProfileDropDown";
import { useState } from "react";

interface AdminHeaderProps {
  handleMenu?: () => void;
}
export const AdminHeader = ({ handleMenu }: AdminHeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileIconClick, setIsProfileIconClick] = useState(false);

  const handleProfile = () => {
    setIsProfileIconClick(!isProfileIconClick);
  };

  return (
    <>
      <section
        className={`${
          theme === "dark"
            ? "dark:bg-slate-900 dark:border-slate-700"
            : "bg-[#f7f7f7] border-gray-300"
        } relative flex justify-between items-center gap-2  pt-3 pb-1.5 border-b mb-4`}
      >
        <div
          className={`${
            theme === "dark" ? "dark:text-white" : "text-gray-500"
          } flex items-center gap-2`}
        >
          <Menu className="cursor-pointer" onClick={handleMenu} size={32} />
          <h1 className="text-[28px]">Dashboard</h1>
        </div>
        <div
          className={`${
            theme === "dark" ? "text-white" : "text-gray-500"
          } flex items-center gap-6 cursor-pointer`}
        >
          <Bell />
          {theme === "dark" ? (
            <Moon onClick={toggleTheme} />
          ) : (
            <Sun onClick={toggleTheme} />
          )}
          <img
            onClick={handleProfile}
            className="w-[48px] h-[48px]"
            src={defaultImg}
            alt=""
          />
        </div>
        {isProfileIconClick && (
          <ProfileDropDown setIsProfileIconClick={setIsProfileIconClick} />
        )}
      </section>
    </>
  );
};
