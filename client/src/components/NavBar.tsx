import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export const NavBar = () => {
  return (
    <>
      <section id="home-section" className="bg-gray-900 pb-[6%]">
        <header className="text-slate-300 py-8 mx-auto max-w-screen-xl navbar flex justify-between items-center cursor-pointer">
          <Link className="text-xl font-bold brand-logo" to="/">
            <img
              src="src/assets/brand-logo.png"
              className="w-24"
              alt="Brand Logo"
            />
          </Link>
          <ul className="nav-items flex gap-8 text-[16px]">
            <li className="nav-item">
              <ScrollLink
                className="nav-item-link"
                to="home-section"
                smooth={true}
                duration={500}
              >
                Home
              </ScrollLink>
            </li>
            <li className="nav-item">
              <Link className="nav-item-link" to="/">
                About
              </Link>
            </li>
            <li className="nav-item">
              <ScrollLink
                className="nav-item-link"
                to="footer-section"
                smooth={true}
                duration={500}
              >
                Contact
              </ScrollLink>
            </li>
            <li className="nav-item">
              <Link
                className="px-6 py-1.5 rounded-full bg-green-700 nav-item-link text-white hover:bg-green-600"
                to="/login"
              >
                Login
              </Link>
            </li>
          </ul>
        </header>
      </section>
    </>
  );
};
