import {
  LucideIcon,
  LayoutGrid,
  Folder,
  User,
  Bookmark,
  LogOut,
  StickyNote,
  Megaphone,
  Layers3,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-image.png";
import brandImage from "../assets/brand-logo.png";
import { useState, useEffect } from "react";
import { useTheme } from "../utlis/ThemeContext";
import axios from "axios";
import { SystemForm } from "./SystemForm";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface SideBarProps {
  type: string;
  navList?: string[];
  role?: string;
  isSidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}

export const SideBar = ({
  type,
  navList,
  role,
  isSidebarVisible,
  setSidebarVisible,
}: SideBarProps) => {
  const { theme } = useTheme();
  const [userName, setUserName] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>();
  const [isFormVisbile, setFormVisible] = useState<boolean>(false);
  const [group, setGroup] = useState<string>("");
  const [activeNavItem, setActiveNavItem] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(false);

  const editFormFields = [
    {
      label: "Enter Name",
      type: "text",
      name: "name",
      id: "name",
    },
    {
      label: "Enter Email",
      type: "email",
      name: "email",
      id: "email",
    },
    // {
    //   label: "Change Password",
    //   type: "password",
    //   name: "password",
    //   id: "password",
    // },
    {
      label: "Select Image",
      type: "file",
      name: "adminImage",
      id: "adminImage",
    },
  ];

  const checkScreenSize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setIsMediumScreen(true);
    } else {
      setIsMediumScreen(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/user-details",
        {
          withCredentials: true,
        }
      );
      console.log("User deatils fetched ", res.data);
      if (res.data.name) {
        setUserName(res.data.name);
      } else if (res.data.studentName) {
        setUserName(res.data.studentName);
      } else {
        setUserName(res.data.teacherName);
      }
      setUserDetails(res.data);
      setGroup(res.data.studentGroup);
      if (role === "student") {
        localStorage.setItem("studentData", JSON.stringify(res.data));
      }
      // console.log("User Details:", userDetails);
    } catch (err: any) {
      console.error("Error:", err.response.message);
    }
  };
  useEffect(() => {
    fetchUser();
    socket.on("userUpdated", (updatedUser) => {
      console.log("User Updated", updatedUser);
      setUserName(
        updatedUser.studentName || updatedUser.teacherName || updatedUser.name
      );
      setUserDetails(updatedUser);
    });

    return () => {
      socket.off("userUpdated");
    };
  }, []);

  const hadleEditProfile = () => {
    console.log("Edit Profile");
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  // Function to refresh user data after profile update
  const handleProfileUpdate = () => {
    fetchUser();
    setFormVisible(false); // Close the form after update
  };

  const handleSettings = () => {
    if (location.pathname.includes("teacher-dashboard")) {
      navigate("/teacher-dashboard/settings");
    } else if (location.pathname.includes("student-dashboard")) {
      navigate("/student-dashboard/settings");
    } else if (location.pathname.includes("admin-dashboard")) {
      navigate("/admin-dashboard/settings");
    }
  };

  // Set up resize event listener to track window size
  useEffect(() => {
    checkScreenSize(); // Check on component mount
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const navIcons: { [key: string]: LucideIcon } = {
    Dashboard: LayoutGrid,
    Module: Folder,
    Teacher: User,
    Student: User,
    Assign: Bookmark,
    "Log Out": LogOut,
    File: Folder,
    Assignment: StickyNote,
    Announcement: Megaphone,
    "Submit Work": Layers3,
    Back: ChevronLeft,
  };

  const navItems =
    navList &&
    navList.map((navItem, key) => {
      const Icon = navIcons[navItem];
      let route = "";

      if (role === "admin") {
        switch (navItem) {
          case "Dashboard":
            route = "/admin-dashboard";
            break;
          case "Module":
            route = "/admin-dashboard/module";
            break;
          case "Teacher":
            route = "/admin-dashboard/teacher";
            break;
          case "Student":
            route = "/admin-dashboard/student";
            break;
          case "Assign":
            route = "/admin-dashboard/assign";
            break;
          case "Log Out":
            route = "/admin-dashboard/logout";
            break;
          default:
            route = "/";
        }
      } else if (role === "student") {
        switch (navItem) {
          case "Dashboard":
            route = "/student-dashboard";
            break;
          case "Log Out":
            route = "/student-dashboard/logout";
            break;
          case "File":
            route = `/student-dashboard/module/file`;
            break;
          case "Assignment":
            route = "/student-dashboard/module/assignment";
            break;
          case "Announcement":
            route = "/student-dashboard/module/announcement";
            break;
        }
      } else if (role === "teacher") {
        switch (navItem) {
          case "Dashboard":
            route = "/teacher-dashboard";
            break;
          case "Log Out":
            route = "/teacher-dashboard/logout";
            break;
          case "File":
            route = `/teacher-dashboard/module/file`;
            break;
          case "Assignment":
            route = "/teacher-dashboard/module/assignment";
            break;
          case "Announcement":
            route = "/teacher-dashboard/module/announcement";
            break;
          case "Submit Work":
            route = "/teacher-dashboard/module/submit-work";
            break;
          case "Back":
            route = "/teacher-dashboard";
            break;
          default:
            route = "/";
        }
      }

      return (
        <Link
          key={key}
          to={route}
          onClick={() => {
            setActiveNavItem(navItem); // Set the active item on click
            if (isMediumScreen) {
              setSidebarVisible(false);
            }
          }}
          className={`nav-li p-4 cursor-pointer flex items-center gap-4 nav-link ${
            activeNavItem === navItem
              ? theme === "dark"
                ? "dark:bg-slate-700"
                : "bg-gray-200"
              : ""
          } ${
            theme === "dark"
              ? "dark:hover:bg-slate-700"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Icon /> {navItem}
        </Link>
      );
    });

  const date = new Date();
  const year = date.getFullYear();

  const imagePath =
    role === "teacher"
      ? userDetails?.teacherImage
        ? `http://localhost:5000/uploads/${userDetails.teacherImage}`
        : defaultImage
      : role === "student"
      ? userDetails?.studentImage
        ? `http://localhost:5000/uploads/${userDetails.studentImage}`
        : defaultImage
      : userDetails?.image
      ? `http://localhost:5000/uploads/${userDetails.image}`
      : defaultImage;

  console.log(isSidebarVisible);

  return (
    <>
      {isFormVisbile && (
        <SystemForm
          fields={editFormFields}
          onClose={handleCloseForm}
          editProfileData={userDetails}
          submitUrl={`http://localhost:5000/api/auth/user-details/${userDetails?._id}`}
          fetchData={handleProfileUpdate} // Refresh data after update
        />
      )}
      <aside
        className={`w-[50vw] md:w-[20vw] h-screen fixed z-[998] transition-transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } ${theme === "dark" ? "dark:bg-slate-800" : "shadow-md bg-gray-50"}`}
      >
        <header
          className={`${
            theme === "dark"
              ? "dark:border-slate-700"
              : "text-gray-500 border-gray-300"
          } flex justify-between py-4 px-2 border-b`}
        >
          <img className="w-[30%]" src={brandImage} alt="Brand Logo" />
          <div className="flex gap-2 items-center">
            {/* <button className="text-[14px] bg-green-800 text-slate-300 px-2.5 py-0.5 rounded">
              {type}
            </button> */}
            <Settings
              size={24}
              className="mr-2 cursor-pointer"
              onClick={handleSettings}
            />
          </div>
        </header>
        {/* <div className="mt-2 flex items-center justify-between mr-2">
          <div></div>
          <Settings size={20} className="text-slate-400" />
        </div> */}
        <section className="main-section">
          <div className="flex justify-center flex-col items-center gap-2 my-12 group">
            <img
              className="object-cover w-16 h-16 rounded-full border border-slate-400"
              src={imagePath}
              alt={userDetails?.name ? userDetails.name : "Default User"}
            />
            <p
              className={` ${
                theme === "dark" ? "dark:text-slate-400" : "text-gray-500"
              } text-[14px]  dynamic-user-name`}
            >
              {userName ? userName : "Default User"}
            </p>
          </div>

          <ul className="nav-ul text-slate-300 space-y-2">{navItems}</ul>

          <footer
            className={`${
              theme === "dark" ? "dark:text-slate-400 " : "text-gray-500"
            } absolute bottom-0 text-[10px] p-2`}
          >
            <p>
              Copyright &copy; {year} by myClassroom. Alright rights reversed.
            </p>
          </footer>
        </section>
      </aside>
    </>
  );
};
