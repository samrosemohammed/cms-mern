import { Users } from "lucide-react";
import { useTheme } from "../utlis/ThemeContext";
export const AdminStats = () => {
  const { theme } = useTheme();
  return (
    <>
      <section
        className={`${
          theme === "dark" ? "dark:text-slate-300" : "text-gray-500"
        } grid grid-cols-4 gap-4`}
      >
        <div
          className={`${
            theme === "dark"
              ? "dark:bg-slate-800"
              : "border border-slate-300 shadow-md"
          } p-2 rounded flex items-center flex-col gap-4`}
        >
          <Users size={28} />
          <h2 className="text-[20px]">Total Module</h2>
          <p
            className={`${
              theme === "dark"
                ? "dark:text-green-400"
                : "text-green-500 font-semibold"
            } text-[18px]`}
          >
            4
          </p>
        </div>
      </section>
    </>
  );
};
