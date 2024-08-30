import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EllipsisVertical, Bookmark, NotepadText } from "lucide-react";
import axios from "axios";
import { FeedBack } from "../FeedBack";
import moment from "moment";
export const TeacherAssignment = () => {
  const [assignments, setAssignments] = useState<any>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();
  const handleCreateAssignment = () => {
    console.log("Create Assignment Clicked");
    navigate("/teacher-dashboard/module/assignment/create");
  };

  const fetchAssignments = async () => {
    try {
      const moduleId = localStorage.getItem("selectedModuleId");
      const assignGroup = localStorage.getItem("assignGroup");
      console.log("Module ID:", moduleId);
      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/assignment/${moduleId}/${assignGroup}`,
        {
          withCredentials: true,
        }
      );
      console.log("Assignments:", response.data);
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    const msgFromLocalStorage = localStorage.getItem("msg");
    if (msgFromLocalStorage) {
      setServerMessage(msgFromLocalStorage);
      localStorage.removeItem("msg"); // Remove the message after displaying it
    }
    fetchAssignments();
  }, []);

  const handleFileDownload = async (fileName: string) => {
    console.log("File Downloaded", fileName);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/assignment/download/${fileName}`,
        {
          withCredentials: true,
          responseType: "blob", // Ensure the response is treated as a file
        }
      );
      // console.log("Response:", response.data.message);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Error downloading file:", err);
    }
  };

  const handleOption = (assignmentId: any) => {
    console.log("Option Clicked", assignmentId);
    setSelectedAssignmentId((prev) =>
      prev === assignmentId ? null : assignmentId
    );
  };

  const handleEditAssignment = (assignmentId: any) => {
    console.log("Edit Assignment Clicked", assignmentId);
    navigate(`/teacher-dashboard/module/assignment/edit/${assignmentId}`);
  };

  const handleDeleteAssignment = async (assignObjectId: any) => {
    setServerMessage("");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/teacher-dashboard/module/assignment/${assignObjectId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data.message);
      setServerMessage(response.data.message);
      fetchAssignments();
    } catch (err: any) {
      console.error("Error deleting resource:", err);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {serverMessage && <FeedBack message={serverMessage} />}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h1 className="tracking-wider text-[18px] text-slate-300 border-b inline-block border-green-400 capitalize">
            Assignment
          </h1>
          <Button onClick={handleCreateAssignment} type={"Create Assignment"} />
        </div>

        <div className="assignment-container">
          <ol className="space-y-8">
            {assignments.map((assignment: any) => (
              <li
                key={assignment._id}
                className="border-b border-slate-600 p-4 rounded"
              >
                <div className="flex justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <NotepadText />
                    <p className="dynamic-week-header">{assignment.title}</p>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <p className="text-slate-400 text-[14px]">
                      <span className="mr-2">Due</span>
                      {moment(assignment.DueDate).year() === currentYear
                        ? moment(assignment.DueDate).format("MMM D")
                        : moment(assignment.DueDate).format("YYYY MMMM D")}
                      , {assignment.DueDateTime}
                      {/* {moment(assignment.createdAt).year() === currentYear
                        ? moment(assignment.createdAt).format("MMM D, h:m A")
                        : moment(assignment.createdAt).format("YYYY MMM D")} */}
                    </p>
                    <EllipsisVertical
                      onClick={() => handleOption(assignment._id)}
                      className="cursor-pointer hover:bg-slate-800 rounded-full"
                    />
                    {selectedAssignmentId === assignment._id && (
                      <div className="absolute top-8 right-3 bg-slate-800 rounded">
                        <ul className="space-y-2">
                          <li
                            className="hover:bg-slate-700 py-1.5 px-4 cursor-pointer"
                            onClick={() => handleEditAssignment(assignment._id)}
                          >
                            Edit
                          </li>
                          <li
                            className="hover:bg-slate-700 py-1.5 px-4 cursor-pointer"
                            onClick={() =>
                              handleDeleteAssignment(assignment._id)
                            }
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="">
                  <p className="text-slate-400 text-[14px] mb-4">
                    Posted
                    <span className="ml-2">
                      {moment(assignment.createdAt).year() === currentYear
                        ? moment(assignment.createdAt).format("MMM D")
                        : moment(assignment.createdAt).format("YYYY MMM D")}
                    </span>
                  </p>
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
                          className="cursor-pointer dynamic-file-name border border-slate-700 p-4 rounded hover:bg-slate-800 truncate whitespace-nowrap overflow-hidden"
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
                        className="cursor-pointer dynamic-file-name border border-slate-700 p-4 rounded hover:bg-slate-800 truncate whitespace-nowrap overflow-hidden"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
};
