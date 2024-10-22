import axios from "axios";
import { useEffect, useState } from "react";
import moduleBanner from "../../assets/module-banner.jpg";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader";
import { useTheme } from "../../utlis/ThemeContext";
export const Module = () => {
  const { theme } = useTheme();
  const [modules, setModules] = useState<any>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const data = localStorage.getItem("studentData");
  const studentData = data && JSON.parse(data);
  useEffect(() => {
    const group = studentData && studentData.studentGroup;
    const createdAdminId = studentData && studentData.createdBy;
    console.log("Group ", group);
    console.log("Created Admin ID ", createdAdminId);
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student-dashboard/${group}/${createdAdminId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Modules fetched ", response.data);
        const sortedModules = response.data.sort((a: any, b: any) =>
          a.moduleDetails.moduleName.localeCompare(b.moduleDetails.moduleName)
        );
        setModules(sortedModules);
        setIsLoading(false);
      } catch (err: any) {
        console.log("Error fetching modules ", err);
      }
    };
    fetchModules();
  }, [
    studentData && studentData.studentGroup,
    studentData && studentData.createdBy,
  ]);

  const handleModuleClick = (moduleObjectId: any, moduleGroup: any) => {
    localStorage.setItem("selectedModuleId", moduleObjectId);
    localStorage.setItem("assignGroup", moduleGroup);
    navigate(`/student-dashboard/module/${moduleObjectId}`);
  };
  return (
    <>
      {isLoading && <Loader />}
      <section>
        <div className="module-div grid grid-cols-3 gap-6">
          {modules.map((module: any) => (
            <div
              key={module._id.moduleCode}
              className={`${
                theme === "dark"
                  ? "bg-slate-800 dark:text-slate-300"
                  : "text-gray-500 shadow-lg"
              } rounded cursor-pointer`}
              onClick={() =>
                handleModuleClick(
                  module.moduleDetails._id,
                  module._id.assignGroup
                )
              }
            >
              <img
                className="rounded-t "
                src={moduleBanner}
                alt="Module Banner Image"
              />
              <div className="space-y-3 p-4">
                <div className="flex justify-between items-center relative">
                  <h2 className="text-[20px]">
                    {module.moduleDetails.moduleName}
                  </h2>
                </div>
                <div className="flex items-center justify-between">
                  <p className="module-code text-[16px]">
                    {module.moduleDetails.moduleID}
                  </p>
                  <p>{module._id.assignGroup}</p>
                </div>
                <div className="flex justify-between items-center text-[14px] text-slate-400">
                  <p>
                    {new Date(
                      module.moduleDetails.moduleDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    {new Date(
                      module.moduleDetails.moduleDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                {/* <p>{module.teacherName}</p> */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
