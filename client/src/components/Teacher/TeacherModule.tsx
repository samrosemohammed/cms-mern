import moduleBanner from "../../assets/module-banner.jpg"; // Adjust the path as necessary
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const TeacherModule = () => {
  const [modules, setModules] = useState<any>([]);
  const navigate = useNavigate();
  console.log("token : ", Cookies.get("token"));

  const handleModuleClick = (id: string, assignGroup: string) => {
    console.log("Module click: ", id);
    navigate(`/teacher-dashboard/module/$${id}`);
    // Store the clicked module ID in local storage
    localStorage.setItem("selectedModuleId", id);
    localStorage.setItem("assignGroup", assignGroup);
  };

  useEffect(() => {
    const fetchAssignedModules = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/teacher-dashboard",
          {
            withCredentials: true, // Include credentials (cookies) with the request
          }
        );
        console.log("Assigned Modules:", response.data);
        // Store the fetched modules data in local storage
        localStorage.setItem("modulesData", JSON.stringify(response.data));
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching assigned modules:", error);
      }
    };

    fetchAssignedModules();
  }, []);
  return (
    <>
      <section className="">
        <div className="module-div grid grid-cols-3 gap-6">
          {modules.map((module: any) => (
            <div
              key={module._id}
              className="bg-slate-800 rounded cursor-pointer"
              onClick={() =>
                handleModuleClick(module.moduleCode._id, module.assignGroup)
              }
            >
              <img
                className="rounded-t"
                src={moduleBanner}
                alt="Module Banner Image"
              />
              <div className="space-y-3 p-4 text-slate-300">
                <div className="flex justify-between items-center relative">
                  <h2 className="text-[20px]">
                    {module.moduleCode.moduleName}
                  </h2>
                </div>
                <div className="flex items-center justify-between">
                  <p className="module-code text-[16px] text-slate-300">
                    {module.moduleID}
                  </p>
                  <p>{module.assignGroup}</p>
                </div>
                <div className="flex justify-between items-center text-[14px] text-slate-400">
                  <p>
                    {new Date(
                      module.moduleCode.moduleDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    {new Date(
                      module.moduleCode.moduleDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
