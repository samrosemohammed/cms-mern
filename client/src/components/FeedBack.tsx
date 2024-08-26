import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface FeedBackProps {
  message: string;
}
export const FeedBack = ({ message }: FeedBackProps) => {
  const [isVisible, setIsVisible] = useState(false);

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
          className={`fixed bottom-4 right-4 bg-slate-800 border border-green-800 p-4 rounded shadow-lg z-[999] transition-transform duration-500 ${
            isVisible ? "translate-x-[0%]" : "translate-x-[150%]"
          }`}
        >
          <div className="flex items-center justify-center gap-4 text-[18px] text-slate-400 tracking-wide">
            <p>{message}</p>
            <X onClick={handleClose} size={28} className="cursor-pointer" />
          </div>
        </section>
      )}
    </>
  );
};
