import { SearchEngine } from "./SearchEngine";
import { useState, useEffect } from "react";
import { SystemForm } from "./SystemForm";
import { FeedBack } from "./FeedBack";
import { Loader } from "./Loader";
import axios from "axios";
import moment from "moment";
import { useTheme } from "../utlis/ThemeContext";

export const AdminAssignModule = () => {
  const { theme } = useTheme();
  const [assignModule, setAssignModule] = useState<any>([]);
  const [clickedAssignModule, setClickAssignModule] = useState<any>({});
  const [isFormVisible, setFormVisible] = useState(false);
  const [serverMessage, setSeverMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const option = "Assign";
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

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  const handleEdit = (data: any) => {
    setFormVisible(true);
    setClickAssignModule(data);
    console.log(data);
    console.log("Edit button clicked");
  };

  const fetchAssignModules = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin-dashboard/module/assign-module",
        {
          withCredentials: true,
        }
      );
      console.log("Assign Modules:", res.data);
      setAssignModule(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching assign modules:", err);
    }
  };

  const handleSearchInput = (event: any) => {
    setSearchQuery(event.target.value);
  }; // console.log(students);

  // Filter students based on the search query
  const filteredAssignModule = assignModule.filter(
    (assignModule: any) =>
      assignModule.moduleCode.moduleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignModule.moduleCode.moduleID
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignModule.teacherId.teacherName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignModule.assignGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (data: any) => {
    setSeverMessage("");
    console.log("Delete button clicked");
    setClickAssignModule(data);
    try {
      await axios
        .delete(
          `http://localhost:5000/api/admin-dashboard/module/assign-module/${data._id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("Assign Module deleted successfully", res.data);
          setSeverMessage(res.data.message);
          fetchAssignModules();
        });
    } catch (err: any) {
      console.error("Error deleting assign module:", err);
    }
  };

  useEffect(() => {
    fetchAssignModules();
  }, []);

  const formatDate = (dateString: any) => {
    return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <>
      <section>
        {isLoading && <Loader />}
        {serverMessage && <FeedBack message={serverMessage} />}

        {isFormVisible && (
          <SystemForm
            fields={assignFields}
            onClose={handleCloseForm}
            assignModuleData={clickedAssignModule}
            submitUrl={`http://localhost:5000/api/admin-dashboard/assign/${clickedAssignModule._id}`}
            option={option}
            fetchData={fetchAssignModules}
            serverMessageFromForm={setSeverMessage}
          />
        )}
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div className="flex gap-4">
            <SearchEngine onSearchInput={handleSearchInput} />
          </div>
        </div>
        <div className=" max-w-screen-xl overflow-auto max-h-[580px] overflow-y-auto shadow-md sm:rounded">
          <table
            className={`${
              theme === "dark" ? "dark:text-gray-400" : "text-gray-500"
            } w-full text-xl text-left rtl:text-right`}
          >
            <thead
              className={`${
                theme === "dark"
                  ? "dark:text-gray-400 dark:bg-gray-600"
                  : "bg-white border-b text-gray-700"
              } sticky top-0 z-10 text-[12px] uppercase`}
            >
              <tr>
                <th scope="" className="px-6 py-1">
                  Module Code
                </th>
                <th scope="" className="px-6 py-1">
                  Module Name
                </th>
                <th scope="" className="px-6 py-1">
                  Teacher Name
                </th>
                <th scope="" className="px-6 py-1">
                  Group Name
                </th>
                <th scope="" className="px-6 py-1">
                  Assign Date
                </th>
                <th scope="" className="px-6 py-1">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {filteredAssignModule.map((assignModule: any) => {
                return (
                  <tr
                    key={assignModule._id}
                    className={`${
                      theme === "dark"
                        ? "dark:bg-gray-800 dark:border-gray-700"
                        : "bg-white"
                    } border-b`}
                  >
                    <th
                      scope="row"
                      className={`${
                        theme === "dark" ? "dark:text-white" : "text-gray-900"
                      } px-6 py-4 font-medium  whitespace-nowrap `}
                    >
                      {assignModule.moduleCode.moduleID}
                    </th>
                    <td className="px-6 py-4">
                      {assignModule.moduleCode.moduleName}
                    </td>
                    <td className="px-6 py-4">
                      {assignModule.teacherId?.teacherName}
                    </td>
                    <td className="px-6 py-4">{assignModule.assignGroup}</td>
                    <td className="px-6 py-4">
                      {formatDate(assignModule.dateAssigned)}
                    </td>
                    <td className="px-0 py-4 flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(assignModule)}
                        className="edit-teacher-btn ml-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignModule)}
                        className="ml-2 font-medium text-red-600 dark:text-red-500 hover:underline delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
