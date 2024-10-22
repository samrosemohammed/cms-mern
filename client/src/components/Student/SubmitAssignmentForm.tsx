import { X, Upload, Link2 } from "lucide-react";
import { Button } from "../Button";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FeedBack } from "../FeedBack";
import { useTheme } from "../../utlis/ThemeContext";
export const SubmitAssignmentForm = () => {
  const { theme } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submittedAssignment, setSubmittedAssignment] = useState<any>([]);
  const [links, setLinks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [newLink, setNewLink] = useState("");
  const navigate = useNavigate();
  const { assignmentObjectId } = useParams();
  const [serverMessage, setServerMessage] = useState("");
  const id = null;
  console.log("Assignment ID:", assignmentObjectId);

  useEffect(() => {
    const fetchSubmittedAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student-dashboard/module/assignment/submit-work/${assignmentObjectId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Submitted Assignment:", response.data);
        if (response.data.submitAssignments[0]) {
          setSubmittedAssignment(response.data.submitAssignments[0]);
          const { files, links } = response.data.submitAssignments[0];
          setLinks(links || []);
          // Create a mock object for each file path to be used in the UI
          const mockFiles = files.map((filePath: string) => ({
            name: filePath.split("\\").pop() || "File",
            path: filePath,
          }));

          setSelectedFiles(mockFiles);
        }
      } catch (err: any) {
        console.error("Error fetching submitted assignment:", err);
      }
    };

    fetchSubmittedAssignment();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleLinkSubmit = () => {
    if (newLink.trim()) {
      setLinks((prevLinks) => [...prevLinks, newLink]);
      setNewLink("");
      setIsLinkFormOpen(false);
    }
  };

  const handleLinkClose = () => {
    setIsLinkFormOpen(false);
  };

  const handleLinkIconClick = () => {
    setIsLinkFormOpen(true);
  };

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloseUpload = () => {
    navigate("/student-dashboard/module/assignment");
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleRemoveFile = async (fileName: string, index: number) => {
    console.log("Remove file:", fileName);
    if (assignmentObjectId) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/student-dashboard/module/assignment/submit-work/resubmit/${assignmentObjectId}/${fileName}`,
          { withCredentials: true }
        );
        console.log("Delete file response:", response.data);
        setSelectedFiles((prevFiles) =>
          prevFiles.filter((_, i) => i !== index)
        );
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = async () => {
    setServerMessage("");
    console.log("Submit Assignment Clicked");
    const selectedModuleId = localStorage.getItem("selectedModuleId");
    const assignGroup = localStorage.getItem("assignGroup");
    const data: any = localStorage.getItem("studentData");
    const parseData: any = JSON.parse(data);
    console.log(parseData);
    const studentObjectId = parseData && parseData._id;
    const currentUrl = window.location.href;
    console.log("location ", currentUrl);

    try {
      const formData = new FormData();

      formData.append("assignGroup", assignGroup ?? "");
      formData.append("moduleId", selectedModuleId ?? "");
      formData.append("assignmentObjectId", assignmentObjectId ?? "");
      formData.append("studentId", studentObjectId ?? "");
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      links.forEach((link) => {
        formData.append("links", link);
      });

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      if (currentUrl.includes("/resubmit/")) {
        const response = await axios.put(
          `http://localhost:5000/api/student-dashboard/module/assignment/submit-work/resubmit/${assignmentObjectId}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
        navigate("/student-dashboard/module/assignment");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/student-dashboard/module/assignment/submit-work",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
        navigate("/student-dashboard/module/assignment");
      }
    } catch (err: any) {
      console.error("Error creating assignment:", err);
      setServerMessage(err.response.data.message);
    }
  };

  return (
    <>
      {serverMessage && <FeedBack message={serverMessage} />}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 items-center">
            <X
              className="cursor-pointer"
              size={28}
              onClick={handleCloseUpload}
            />
            <h1 className="text-[20px]">Submit Work</h1>
          </div>
          <Button
            onClick={handleSubmitAssignment}
            type={id ? "Save" : "Post"}
          />
        </div>

        <form action="" className="space-y-2">
          {/* File Area */}
          <div className="file-area space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`${
                  theme === "dark" ? "border-slate-700" : "border-gray-300"
                } file-item flex justify-between items-center border p-2 rounded`}
              >
                <div>{file.name}</div>
                <X
                  size={32}
                  className="cursor-pointer"
                  onClick={() => handleRemoveFile(file.name, index)}
                />
              </div>
            ))}
          </div>

          {/* Link Area */}
          <div className="link-area space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className={`${
                  theme === "dark" ? " border-slate-700" : "border-gray-300"
                } link-item flex justify-between items-center border p-2 rounded`}
              >
                <div>
                  <p>Link</p>
                  <span className="text-slate-400">{link}</span>
                </div>
                <X
                  size={32}
                  className="cursor-pointer"
                  onClick={() => handleRemoveLink(index)}
                />
              </div>
            ))}
          </div>

          <div
            className={`${
              theme === "dark" ? "border-slate-700" : "border-gray-300"
            } attach-resource border p-4 rounded`}
          >
            <h3 className="text-[18px] mb-4">Attach</h3>
            <div className="flex justify-center items-center h-full">
              <div className="flex gap-6">
                <div
                  className="flex items-center flex-col gap-2 cursor-pointer"
                  onClick={handleUploadIconClick}
                >
                  <Upload
                    className="border border-slate-400 p-2 rounded-full"
                    size={42}
                  />
                  <p>Upload</p>
                </div>
                <div
                  className="flex items-center flex-col gap-2 cursor-pointer"
                  onClick={handleLinkIconClick}
                >
                  <Link2
                    className="border border-slate-400 p-2 rounded-full"
                    size={42}
                  />
                  <p>Link</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            multiple // Allow multiple files
          />
        </form>
      </section>

      {/* Link Form Pop-Up */}
      {isLinkFormOpen && (
        <section
          className={`${
            theme === "dark" ? " bg-slate-900" : "bg-[#00000055]"
          } fixed bg-opacity-80 inset-0 flex items-center justify-center`}
        >
          <form
            action=""
            onSubmit={handleLinkSubmit}
            className={`${
              theme === "dark" ? " bg-slate-800" : "shadow-md bg-white"
            } p-4 forLink max-w-[400px] rounded space-y-4`}
          >
            <div className="flex items-center justify-between">
              <h3>Add Link</h3>
              <X className="cursor-pointer" onClick={handleLinkClose} />
            </div>
            <input
              className={`${
                theme === "dark" ? "border-slate-700" : "border-gray-300"
              } outline-none w-full bg-transparent border-b p-2`}
              placeholder="Link"
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <input
              type="submit"
              onClick={handleLinkSubmit}
              className={`${
                theme === "dark"
                  ? "bg-green-800"
                  : "bg-green-200 text-green-700"
              } px-1.5 py-1 w-full rounded`}
            />
          </form>
        </section>
      )}
    </>
  );
};
