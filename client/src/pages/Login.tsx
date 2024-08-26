import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../utlis/AuthContext";
import Cookies from "js-cookie";

export const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  Axios.defaults.withCredentials = true;
  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await Axios.post("http://localhost:5000/api/auth/login", {
        email: userEmail,
        password: userPassword,
      });

      if (res.data.success) {
        // Save the token to localStorage
        // localStorage.setItem("token", res.data.token);
        // Redirect to admin dashboard
        Cookies.set("token", res.data.token, { expires: 1 });
        login();
        if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (res.data.role === "teacher") {
          navigate("/teacher-dashboard");
        } else if (res.data.role === "student") {
          navigate("/student-dashboard");
        }
      }
    } catch (err: any) {
      console.error("Error:", err.response.data);
      alert("Invalid Credentials");
    }
  };

  return (
    <section className="login-section grid place-items-center h-screen">
      <div className="login-div max-w-md mx-auto ">
        <img
          className="w-36 mx-auto mb-6"
          src="src/assets/brand-logo.png"
          alt="Brand Logo"
        />
        <div className="form-container bg-gray-800 p-6 rounded-lg">
          <h2 className="mb-4 text-[24px] font-semibold tracking-tighter">
            Sign in to your account
          </h2>
          <form onSubmit={handleLoginSubmit} className="login-form space-y-4">
            <label
              className="text-[16px] text-slate-250 inline-block"
              htmlFor="email"
            >
              Your email
            </label>
            <input
              className="w-full border-none outline-none bg-gray-700 py-1.5 px-2.5 rounded-lg focus:ring-1 focus:ring-blue-400"
              placeholder="name@company.com"
              type="text"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <label
              className="text-[16px] text-slate-250 inline-block"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full border-none outline-none bg-gray-700 py-1.5 px-2.5 rounded-lg focus:ring-1 focus:ring-blue-400"
              placeholder="*********"
              type="password"
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <div className="flex justify-between space-y-2">
              <div className="space-x-2 flex items-center">
                <input className="w-[16px] h-[16px]" type="checkbox" />
                <label
                  className="text-slate-250 text-[16px] inline-block"
                  htmlFor="remember"
                >
                  Remember Me
                </label>
              </div>
              <a className="text-slate-400 hover:underline" href="#">
                Forgot Password ?
              </a>
            </div>
            <button
              type="submit"
              className="hover:bg-green-700 bg-green-600 px-2 py-1.5 rounded-lg block w-full"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
