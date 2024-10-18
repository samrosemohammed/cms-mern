import { Search } from "lucide-react";
import { useTheme } from "../utlis/ThemeContext";

interface SearchEngineProps {
  onSearchInput?: (event: any) => void;
}

export const SearchEngine = ({ onSearchInput }: SearchEngineProps) => {
  const { theme } = useTheme();
  return (
    <>
      <section className="relative">
        <Search
          size={22}
          className={`${
            theme === "dark" ? "dark:text-slate-400" : "text-gray-500"
          } absolute top-[11.5%] left-[8px] `}
        />
        <input
          type="text"
          className={`${
            theme === "dark" ? "dark:bg-slate-800" : "bg-gray-200 text-gray-500"
          } w-[24vw] pl-10 px-2.5 py-1.5 rounded outline-none`}
          placeholder="Search..."
          onChange={onSearchInput}
        />
      </section>
    </>
  );
};
