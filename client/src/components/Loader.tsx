import { useTheme } from "../utlis/ThemeContext";
export const Loader = () => {
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`${
          theme === "dark" ? "bg-slate-900" : "bg-[#00000055]"
        } fixed inset-0 bg-opacity-80 flex items-center justify-center z-[999]`}
      >
        <div
          className={`${
            theme === "dark" ? "dark:text-slate-600" : "text-gray-50"
          } h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]`}
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    </>
  );
};
