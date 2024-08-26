import { Menu } from "lucide-react";
export const AdminHeader = () => {
  return (
    <>
      <section className="flex items-center gap-2  pt-3 pb-1.5 border-b border-slate-700 mb-4">
        <Menu size={32} />
        <h1 className="text-[28px]">Dashboard</h1>
      </section>
    </>
  );
};
