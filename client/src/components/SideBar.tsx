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
} from "lucide-react";
import { Link } from "react-router-dom";
import defaultImage from "../assets/default-image.png";
import brandImage from "../assets/brand-logo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { SystemForm } from "./SystemForm";

interface SideBarProps {
  type: string;
  navList?: string[];
  role?: string;
}

export const SideBar = ({ type, navList, role }: SideBarProps) => {
  const [userName, setUserName] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>();
  const [isFormVisbile, setFormVisible] = useState<boolean>(false);
  const [group, setGroup] = useState<string>("");

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

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/user-details",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
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
          className="nav-li hover:bg-slate-700 p-4 cursor-pointer flex items-center gap-4 nav-link"
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
      <aside className="w-[20vw] h-screen bg-gray-800 fixed z-[997]">
        <header className="flex justify-between py-4 px-2 border-b border-slate-700">
          <img className="w-[30%]" src={brandImage} alt="Brand Logo" />
          <button className="text-[14px] bg-green-800 text-slate-300 px-2.5 py-0.5 rounded">
            {type}
          </button>
        </header>

        <section className="main-section">
          <div className="flex justify-center flex-col items-center gap-2 my-12 group">
            <button
              onClick={hadleEditProfile}
              className="text-slate-400 text-[14px] bg-slate-700 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Edit Profile
            </button>
            <img
              className="object-cover w-16 h-16 rounded-full border border-slate-400"
              src={imagePath}
              alt={userDetails?.name ? userDetails.name : "Default User"}
            />
            <p className="text-[14px] text-slate-400 dynamic-user-name">
              {userName ? userName : "Default User"}
            </p>
          </div>

          <ul className="nav-ul text-slate-300 space-y-2">{navItems}</ul>

          <footer className="absolute bottom-0 text-slate-400 text-[10px] p-2">
            <p>
              Copyright &copy; {year} by myClassroom. Alright rights reversed.
            </p>
          </footer>
        </section>
      </aside>
    </>
  );
};
