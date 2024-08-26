import { Users } from "lucide-react";
export const AdminStats = () => {
  return (
    <>
      <section className="grid grid-cols-4 gap-4 text-slate-300">
        <div className="bg-slate-800 p-2 rounded flex items-center flex-col gap-4">
          <Users size={28} />
          <h2 className="text-[20px]">Total Module</h2>
          <p className="text-green-400 text-[18px]">4</p>
        </div>
      </section>
    </>
  );
};
