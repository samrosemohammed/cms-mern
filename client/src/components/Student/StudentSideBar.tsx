import { SideBar } from "../SideBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface StudentSideBar {
  isSidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}
export const StudentSideBar = ({
  isSidebarVisible,
  setSidebarVisible,
}: StudentSideBar) => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<string[]>(["Dashboard"]);

  useEffect(() => {
    if (location.pathname.startsWith("/student-dashboard/module")) {
      setNavItems(["Back", "File", "Assignment", "Announcement"]);
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
        role="student"
      />
    </>
  );
};
