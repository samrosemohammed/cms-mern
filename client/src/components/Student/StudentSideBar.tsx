import { SideBar } from "../SideBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
export const StudentSideBar = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<string[]>(["Dashboard"]);

  useEffect(() => {
    if (location.pathname.startsWith("/student-dashboard/module")) {
      setNavItems(["Back", "File", "Assignment", "Announcement"]);
    } else {
      setNavItems(["Dashboard"]);
    }
  }, [location.pathname]);
  return (
    <>
      <SideBar type={"Teacher"} navList={navItems} role="student" />
    </>
  );
};
