import { SystemForm } from "./SystemForm";
import { Loader } from "./Loader";
import { useState } from "react";
import axios from "axios";

interface OptionBoxProps {
  type: string[];
  moduleData?: any;
  setServerMessage?: (message: string) => void;
  closeOptionBox?: () => void; // Add this prop to handle closing the option box
  fetchModules?: () => void; // Add this prop to handle fetching modules
}

export const OptionBox = ({
  type,
  moduleData,
  setServerMessage,
  closeOptionBox, // Destructure the new prop
  fetchModules, // Destructure fetchModules prop
}: OptionBoxProps) => {
  // console.log(moduleData);
  const editFields = [
    {
      label: "Enter Module Name",
      type: "text",
      name: "moduleName",
      id: "moduleName",
    },
    {
      label: "Module ID",
      type: "text",
      name: "moduleID",
      id: "moduleID",
    },
    {
      label: "Start Date",
      type: "date",
      name: "moduleDate",
      id: "moduleDate",
    },
    {
      label: "End Date",
      type: "date",
      name: "moduleEndDate",
      id: "moduleEndDate",
    },
  ];

  const assignFields = [
    {
      label: "Teacher Name",
      type: "select",
      name: "teacherName",
      id: "teacherName",
      options: ["Teacher 1", "Teacher 2", "Teacher 3"],
    },
    {
      label: "Group",
      type: "select",
      name: "assignGroup",
      id: "assignGroup",
      options: ["Group 1", "Group 2", "Group 3"],
    },
  ];

  const [isFormVisible, setFormVisible] = useState(false);
  const [formFields, setFormFields] = useState<any[]>([]); // To hold the fields to be used in SystemForm
  const [option, setOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  const formVisible = () => {
    setFormVisible(true);
    setServerMessage && setServerMessage("");
  };

  const handleOptionClick = (option: string) => {
    setOption(option);
    switch (option) {
      case "Edit":
        setFormFields(editFields);
        formVisible();

        break;
      case "Assign":
        setFormFields(assignFields);
        formVisible();

        break;
      case "Delete":
        // console.log("Module deleted");
        handleDeleteModule(moduleData.moduleCode);
        // setIsLoading(true); // Set loading to true before fetching
        setIsLoading(true);
        closeOptionBox && closeOptionBox(); // Close the option box after an option is selected

        break;
      default:
      // console.log("Invalid option");
    }
  };

  // console.log(option);
  const editUrl = `http://localhost:5000/api/admin-dashboard/module/${moduleData.moduleCode}`;
  const createUrl = `http://localhost:5000/api/admin-dashboard/module/assign-module`;
  const submitUrl = option === "Edit" ? editUrl : createUrl;
  const handleDeleteModule = async (moduleId: string) => {
    setServerMessage && setServerMessage("");
    setIsLoading(true);
    try {
      await axios
        .delete(
          `http://localhost:5000/api/admin-dashboard/module/${moduleId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data);
          setServerMessage && setServerMessage(res.data.message);
          fetchModules && fetchModules(); // Fetch the updated module list
          setIsLoading(false);
        });
      // console.log("Module deleted successfully");
      // Optionally, refresh the module list or provide feedback to the user
    } catch (err) {
      console.error("Error deleting module:", err);
      setServerMessage && setServerMessage("Error deleting Module");
    }
  };

  // handleDeleteModule(moduleData.moduleCode);
  return (
    <>
      {isLoading && <Loader />} {/* Show loader when loading */}
      <div className="bg-slate-700 rounded absolute right-5 bottom-[28px] z-[999]">
        {isFormVisible && (
          <SystemForm
            fields={formFields}
            onClose={() => {
              handleCloseForm();
              closeOptionBox && closeOptionBox();
            }}
            moduleData={moduleData}
            submitUrl={submitUrl}
            option={option}
            fetchData={fetchModules}
            serverMessageFromForm={setServerMessage}
          />
        )}
        <ul className="">
          {type.map((eachType) => (
            <li
              key={eachType} // Add key for list items
              onClick={() => handleOptionClick(eachType)}
              className="text-[14px] cursor-pointer px-4 py-1.5 hover:bg-slate-900"
            >
              {eachType}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
