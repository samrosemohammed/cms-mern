import { SideBar } from "../SideBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface TeacherSideBar {
  isSidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}
export const TeacherSideBar = ({
  isSidebarVisible,
  setSidebarVisible,
}: TeacherSideBar) => {
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
      <SideBar
        isSidebarVisible={isSidebarVisible}
        setSidebarVisible={setSidebarVisible}
        type={"Teacher"}
        navList={navItems}
        role="teacher"
      />
    </>
  );
};
