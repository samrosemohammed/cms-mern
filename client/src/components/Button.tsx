import { Plus } from "lucide-react";
interface ButtonProps {
  type: string;
  onClick?: () => void;
}

export const Button = ({ type, onClick }: ButtonProps) => {
  return (
    <>
      <div className="mb-4">
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-800 text-[16px] rounded"
        >
          {type} <Plus size={24} />
        </button>
      </div>
    </>
  );
};
