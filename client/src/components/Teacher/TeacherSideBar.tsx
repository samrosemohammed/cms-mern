import { SideBar } from "../SideBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const TeacherSideBar = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<string[]>(["Dashboard"]);

  useEffect(() => {
    if (location.pathname.startsWith("/teacher-dashboard/module")) {
      setNavItems([
        "Back",
        "File",
        "Assignment",
        "Announcement",
        "Submit Work",
      ]);
    } else {
      setNavItems(["Dashboard", "Log Out"]);
    }
  }, [location.pathname]);

  return (
    <>
      <SideBar type={"Teacher"} navList={navItems} role="teacher" />
    </>
  );
};
