import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import { useTheme } from "../../utlis/ThemeContext";

export const SubmitWork = () => {
  const [submitWork, setSubmitWork] = useState<any>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchSubmitWork = async () => {
      const moduleId = localStorage.getItem("selectedModuleId");
      const selectedGroup = localStorage.getItem("assignGroup");
      console.log("module id", moduleId);
      console.log("selected group", selectedGroup);

      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/submit-work/${moduleId}/${selectedGroup}`,
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);
      setSubmitWork(response.data.submitWork);
    };
    fetchSubmitWork();
  }, []);

  console.log("Submit Work:", submitWork);

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`${
              theme === "dark" ? "dark:text-slate-300" : "text-gray-600"
            } tracking-wider text-[18px] border-b inline-block border-green-400 capitalize`}
          >
            Submitted Work
          </h1>
        </div>
        <div className="overflow-x-auto">
          <table
            className={`${
              theme === "dark" ? "dark:text-gray-400" : "text-gray-500"
            } max-w-screen-xl text-sm text-left rtl:text-right`}
          >
            <thead
              className={`${
                theme === "dark"
                  ? "dark:bg-gray-700 dark:text-gray-400"
                  : "text-gray-500 bg-gray-200"
              } text-sm uppercase`}
            >
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Group
                </th>
                <th scope="col" className="px-6 py-3">
                  Assignment
                </th>
                <th scope="col" className="px-6 py-3">
                  Files
                </th>
                <th scope="col" className="px-6 py-3">
                  Links
                </th>
                <th scope="col" className="px-6 py-3">
                  Submitted Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="dynamic-submit-body">
              {submitWork.map((work: any, index: any) => (
                <tr
                  key={index}
                  className={`${
                    theme === "dark"
                      ? "dark:bg-gray-800 dark:border-gray-700"
                      : "bg-gray-50  shadow-lg"
                  } submit-parent border-b`}
                >
                  <th
                    scope="row"
                    className={`${
                      theme === "dark" ? "dark:text-slate-300" : "text-gray-900"
                    } flex items-center gap-3 px-6 py-4 font-medium  whitespace-nowrap `}
                  >
                    <p>{work.studentId.studentID}</p>
                  </th>
                  <td className="px-6 py-4">{work.studentId.studentName}</td>
                  <td className="px-6 py-4">{work.assignGroup}</td>
                  <td className="px-6 py-4">
                    {work.assignmentId?.title || "No Title"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-3">
                      {work.files && work.files.length > 0 ? (
                        work.files.map((file: string, fileIndex: number) => (
                          <div key={fileIndex}>
                            <a
                              href={`http://localhost:5000/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              File {fileIndex + 1}
                            </a>
                          </div>
                        ))
                      ) : (
                        <p>No file</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-3">
                      {work.links && work.links.length > 0 ? (
                        work.links.map((link: string, linkIndex: number) => (
                          <div key={linkIndex}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Link {linkIndex + 1}
                            </a>
                          </div>
                        ))
                      ) : (
                        <p>No link</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {moment(work.submissionDate).format("M/D/YYYY (hh:mm A)")}
                  </td>
                  <td
                    className={`${
                      work.status === "On Time"
                        ? "text-green-600"
                        : work.status === "Late Submit"
                        ? theme === "dark"
                          ? "text-red-600"
                          : "text-red-400"
                        : ""
                    } text-center text-[12px] font-semibold`}
                  >
                    {work.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
console.log("discord-samrose");
