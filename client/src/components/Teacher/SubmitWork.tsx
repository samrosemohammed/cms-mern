import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";

export const SubmitWork = () => {
  const [submitWork, setSubmitWork] = useState<any>([]);

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
          <h1 className="tracking-wider text-[18px] text-slate-300 border-b inline-block border-green-400 capitalize">
            Submitted Work
          </h1>
        </div>
        <div className="overflow-x-auto">
          <table className="max-w-screen-xl text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                  className="submit-parent bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="flex items-center gap-3 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-slate-300"
                  >
                    <p>{work.studentId.studentID}</p>
                  </th>
                  <td className="px-6 py-4">{work.studentId.studentName}</td>
                  <td className="px-6 py-4">{work.assignGroup}</td>
                  <td className="px-6 py-4">{work.assignmentId.title}</td>
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
                        ? "text-red-600"
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
