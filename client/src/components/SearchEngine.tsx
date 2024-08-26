import { Search } from "lucide-react";

interface SearchEngineProps {
  onSearchInput?: (event: any) => void;
}

export const SearchEngine = ({ onSearchInput }: SearchEngineProps) => {
  return (
    <>
      <section className="relative">
        <Search
          size={22}
          className="absolute top-[11.5%] left-[8px] text-slate-400"
        />
        <input
          type="text"
          className="w-[24vw] bg-slate-800 pl-10 px-2.5 py-1.5 rounded"
          placeholder="Search..."
          onChange={onSearchInput}
        />
      </section>
    </>
  );
};
