import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../utlis/ThemeContext";

interface FeedBackProps {
  message: string;
}
export const FeedBack = ({ message }: FeedBackProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // Hide after 5 seconds

      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <section
          className={`${
            theme === "dark"
              ? "dark:bg-slate-800 dark:border-green-800"
              : "bg-gray-200 text-gray-700 border-transparent"
          } fixed shadow-lg bottom-4 right-4 p-4 rounded  z-[999] transition-transform duration-500 border ${
            isVisible ? "translate-x-[0%]" : "translate-x-[150%]"
          }`}
        >
          <div className="flex items-center justify-center gap-4 text-[18px] tracking-wide">
            <p>{message}</p>
            <X onClick={handleClose} size={28} className="cursor-pointer" />
          </div>
        </section>
      )}
    </>
  );
};
