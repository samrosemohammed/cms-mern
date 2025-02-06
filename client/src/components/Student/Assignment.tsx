import { useState, useEffect } from "react";
import { NotepadText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FeedBack } from "../FeedBack";
import { useTheme } from "../../utlis/ThemeContext";

export const Assignment = () => {
  const { theme } = useTheme();
  const [assignments, setAssignments] = useState<any>([]);
  const [submittedAssignment, setSubmittedAssignment] = useState<any>([]);
  const navigate = useNavigate();
  const moduleId = localStorage.getItem("selectedModuleId");
  const [serverMessage, setServerMessage] = useState("");

  const fetchSubmittedAssignment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/student-dashboard/module/assignment/submit-work/${moduleId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Submitted Assignment:", response.data);
      setSubmittedAssignment(response.data.submitAssignments);
    } catch (err: any) {
      console.error("Error fetching submitted assignment:", err);
    }
  };

  useEffect(() => {
    const fetchModuleAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student-dashboard/module/assignment/${moduleId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Module Assignment:", response.data);
        setAssignments(response.data);
      } catch (err: any) {
        console.error("Error fetching module assignment:", err);
      }
    };

    fetchModuleAssignment();
    fetchSubmittedAssignment();
  }, []);

  const handleFileDownload = async (fileName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/student-dashboard/module/assignment/${fileName}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      // Extract the original file name (before the last '-')
      const fullName = fileName.replace(/^uploads\\/, ""); // Remove the 'uploads\' part
      const lastHyphenIndex = fullName.lastIndexOf("-"); // Find the last hyphen in the file name
      const originalName = fullName.slice(0, lastHyphenIndex); // Get the name before the last hyphen
      const extension = fullName.split(".").pop(); // Get the file extension

      // Create a download URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set the correct name for the downloaded file
      link.setAttribute("download", `${originalName}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Error downloading file:", err);
    }
  };

  const handleSubmitAssignment = (assignmentObjectId: string) => {
    navigate(
      `/student-dashboard/module/assignment/submit-work/${assignmentObjectId}`
    );
  };

  const handleUnsubmit = async (assignmentObjectId: string) => {
    setServerMessage("");
    console.log("Unsubmitting assignment:", assignmentObjectId);
    // Handle unsubmission logic here
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/student-dashboard/module/assignment/delete-submit-work/${assignmentObjectId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Unsubmitted assignment:", response.data);
      setServerMessage(response.data.message);
      fetchSubmittedAssignment();
    } catch (err: any) {
      console.error("Error unsubmitting assignment:", err);
    }
  };

  const handleResubmit = (assignmentObjectId: string) => {
    console.log("Resubmitting assignment:", assignmentObjectId);
    fetchSubmittedAssignment();
    // Handle resubmission logic here
    navigate(
      `/student-dashboard/module/assignment/submit-work/resubmit/${assignmentObjectId}`
    );
  };

  console.log("Submitted Assignment 2:", submittedAssignment);

  const currentYear = new Date().getFullYear();

  return (
    <>
      {serverMessage && <FeedBack message={serverMessage} />}
      <section>
        <div className="assignment-container">
          <ol className="space-y-8">
            {assignments.map((assignment: any) => {
              const dueDateTime = moment(
                `${assignment.DueDate} ${assignment.DueDateTime}`,
                "YYYY-MM-DD hh:mm A"
              );
              const isPastDue = moment().isAfter(dueDateTime);
              return (
                <li
                  key={assignment._id}
                  className={`${
                    theme === "dark"
                      ? "dark:border-slate-600"
                      : "border-gray-300"
                  } border-b p-4 rounded`}
                >
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <NotepadText />
                      <p className="dynamic-week-header">{assignment.title}</p>
                    </div>
                    <div
                      className={`${
                        theme === "dark" ? "text-slate-400" : "text-inherit"
                      } text-[14px]`}
                    >
                      <div className="flex items-center gap-2">
                        <p>
                          Due{" "}
                          {moment(assignment.DueDate).year() === currentYear
                            ? moment(assignment.DueDate).format("MMMM D")
                            : moment(assignment.DueDate).format("YYYY MMMM D")}
                          , {assignment.DueDateTime}{" "}
                        </p>
                        <span
                          className={`text-[12px] px-2 py-0.5 rounded bg-opacity-50 ${
                            submittedAssignment?.find(
                              (submitted: any) =>
                                submitted.assignmentId === assignment._id
                            )?.status === "On Time"
                              ? "bg-green-800 text-slate-300"
                              : submittedAssignment?.find(
                                  (submitted: any) =>
                                    submitted.assignmentId === assignment._id
                                )?.status === "Late Submit"
                              ? `${
                                  theme === "dark"
                                    ? "bg-red-900 text-slate-300"
                                    : "bg-red-200 text-red-600"
                                }`
                              : ""
                          }`}
                        >
                          {submittedAssignment?.find(
                            (submitted: any) =>
                              submitted.assignmentId === assignment._id
                          )?.status === "Late Submit"
                            ? "Late Submit"
                            : submittedAssignment?.find(
                                (submitted: any) =>
                                  submitted.assignmentId === assignment._id
                              )?.status === "On Time"
                            ? "On Time"
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <p className="dynamic-description mb-4">
                      {assignment.description}
                    </p>
                    <div className="file-container grid grid-cols-4 gap-4">
                      {assignment.files?.map((file: string, index: number) => {
                        // Remove the 'uploads\' part
                        const fullName = file.replace(/^uploads\\/, "");

                        // Find the last occurrence of '-' and extract the part before it
                        const lastDashIndex = fullName.lastIndexOf("-");

                        // Extract the original name (everything before the last '-')
                        const originalName =
                          lastDashIndex !== -1
                            ? fullName.substring(0, lastDashIndex)
                            : fullName;

                        // Extract the file extension
                        const extension = fullName.split(".").pop();

                        return (
                          <p
                            key={index}
                            title={
                              originalName
                                ? `${originalName}.${extension}`
                                : "No file available"
                            }
                            onClick={() => handleFileDownload(file)}
                            className={`${
                              theme === "dark"
                                ? "dark:border-slate-700 dark:hover:bg-slate-800"
                                : "border-slate-300 hover:bg-gray-200"
                            } cursor-pointer dynamic-file-name border p-4 rounded truncate whitespace-nowrap overflow-hidden`}
                          >
                            {`${originalName}.${extension}`}
                          </p>
                        );
                      })}

                      {assignment.links?.map((link: string, index: number) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link}
                          className={`${
                            theme === "dark"
                              ? "dark:border-slate-700 dark:hover:bg-slate-800"
                              : "border-slate-300 hover:bg-gray-200"
                          } cursor-pointer dynamic-file-name border p-4 rounded truncate whitespace-nowrap overflow-hidden`}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div></div>
                    <div className="space-x-3">
                      {/* Conditional buttons */}
                      {submittedAssignment?.some(
                        (submitted: any) =>
                          submitted.assignmentId === assignment._id
                      ) ? (
                        <>
                          <button
                            onClick={() => handleUnsubmit(assignment._id)}
                            className={`${
                              theme === "dark"
                                ? "hover:bg-red-800 hover:text-white  text-red-400"
                                : "hover:bg-red-200 text-red-600"
                            } px-1.5 py-0.5 rounded border border-transparent`}
                          >
                            Unsubmit
                          </button>
                          <button
                            onClick={() => handleResubmit(assignment._id)}
                            className={`${
                              theme === "dark"
                                ? " hover:bg-blue-800 hover:text-white text-blue-400 "
                                : "text-blue-600 hover:bg-blue-200"
                            } px-1.5 py-0.5 border border-transparent rounded`}
                          >
                            Re-submit
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleSubmitAssignment(assignment._id)}
                          className={`${
                            theme === "dark"
                              ? isPastDue
                                ? "bg-red-600/50 text-white cursor-not-allowed"
                                : "bg-blue-800"
                              : isPastDue
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-200 text-blue-600"
                          }  px-1.5 py-0.5 rounded`}
                          disabled={isPastDue}
                        >
                          {isPastDue ? "Missing" : "Submit Assignment"}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
};
