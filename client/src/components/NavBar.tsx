import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: { role: string };
  iat: number;
  exp: number;
}
export const NavBar = () => {
  const [userRole, setUserRole] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        console.log("Decoded : ", decodedToken);
        console.log("User Role : ", decodedToken.user);
        console.log("User Role : ", decodedToken.user.role);
        setUserRole(decodedToken.user.role);
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }, []);

  const handleLoginClick = () => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else if (userRole === "teacher") {
      navigate("/teacher-dashboard");
    } else if (userRole === "student") {
      navigate("/student-dashboard");
    } else {
      navigate("/login");
    }
  };
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
                Homee
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
              <button
                className="px-6 rounded-full bg-green-700 nav-item-link text-white hover:bg-green-600"
                onClick={handleLoginClick}
              >
                Login
              </button>
            </li>
          </ul>
        </header>
      </section>
    </>
  );
};
