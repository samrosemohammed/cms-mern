import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const moveRightIcon = <MoveRight className="inline-block" />;
  return (
    <>
      <section id="" className="bg-gray-900 pb-[6%]">
        <div className="max-w-[1200px] mx-auto text-center hero-section">
          <h1 className="text-slate-300 text-[56px] font-extrabold tracking-tighter max-w-[980px] mx-auto leading-tight mb-6">
            Discover a Smarter Way to Teach and Learn with myClassroom
          </h1>
          <p className="mx-auto text-slate-300 max-w-[800px] leading-loose tracking-wide mb-10 text-[18px]">
            Welcome to myClassroom, the innovative platform that revolutionizes
            the way educators teach and students learn. With myClassroom, you
            can create engaging and interactive learning experiences that
            inspire curiosity and foster collaboration.
          </p>

          <div className="btn-box space-x-4 text-lg text-slate-300">
            <Link className="btn px-4 py-2.5 bg-green-800 rounded" to="/login">
              Get Started
            </Link>
            <a className="btn px-4 py-2.5 bg-gray-800 rounded" href="">
              Explore More {moveRightIcon}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
