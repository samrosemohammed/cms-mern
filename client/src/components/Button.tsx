import { Plus } from "lucide-react";
import { useTheme } from "../utlis/ThemeContext";
interface ButtonProps {
  type: string;
  onClick?: (e?: any) => void;
}

export const Button = ({ type, onClick }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <>
      <div className="mb-4">
        <button
          onClick={onClick}
          className={`${
            theme === "dark"
              ? "dark:bg-green-800"
              : "bg-green-200 text-green-900"
          } flex items-center gap-1.5 px-2.5 py-1.5 text-[16px] rounded`}
        >
          {type} <Plus size={24} />
        </button>
      </div>
    </>
  );
};
