import { Bell, Menu, Moon, Sun } from "lucide-react";
import defaultImg from "../assets/default-image.png";
import { useState } from "react";
import { useTheme } from "../utlis/ThemeContext";

interface AdminHeaderProps {
  handleMenu?: () => void;
}
export const AdminHeader = ({ handleMenu }: AdminHeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <section
        className={`${
          theme === "dark"
            ? "dark:bg-slate-900 dark:border-slate-700"
            : "bg-[#f7f7f7] border-gray-300"
        } flex justify-between items-center gap-2  pt-3 pb-1.5 border-b mb-4`}
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
          } flex items-center gap-4 cursor-pointer`}
        >
          <Bell />
          {theme === "dark" ? (
            <Moon onClick={toggleTheme} />
          ) : (
            <Sun onClick={toggleTheme} />
          )}
          <img className="w-[48px] h-[48px]" src={defaultImg} alt="" />
        </div>
      </section>
    </>
  );
};
