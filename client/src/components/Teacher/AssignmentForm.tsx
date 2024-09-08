import { X, Upload, Link2 } from "lucide-react";
import { Button } from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { FeedBack } from "../FeedBack";

export const AssignmentForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [newLink, setNewLink] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("Assignment id : ", id);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/teacher-dashboard/module/assignment/edit/${id}`,
            {
              withCredentials: true,
            }
          );
          console.log("Assignment:", response.data);
          const { title, description, DueDate, DueDateTime, links, files } =
            response.data.assignments[0];
          setTitle(title);
          setDescription(description);
          setDate(DueDate);
          // Parse the time to a 24-hour format

          const formattedTime = moment(DueDateTime, [
            "hh:mm A",
            "HH:mm",
          ]).format("HH:mm");
          setTime(formattedTime || "");
          setLinks(links || []);

          // Create a mock object for each file path to be used in the UI
          const mockFiles = files.map((filePath: string) => ({
            name: filePath.split("\\").pop() || "File",
            path: filePath,
          }));

          setSelectedFiles(mockFiles);
        } catch (error) {
          console.error("Error fetching assignment:", error);
        }
      }
    };

    fetchAssignment();
  }, [id]);

  const handleCloseUpload = () => {
    console.log("Close Upload");
    navigate("/teacher-dashboard/module/assignment");
  };

  const handleCreateAssignment = async () => {
    setServerMessage("");
    const selectedModuleId = localStorage.getItem("selectedModuleId");
    const assignGroup = localStorage.getItem("assignGroup");
    const data: any = localStorage.getItem("modulesData");
    const parseData: any = JSON.parse(data);
    console.log(parseData);
    const teacherObjectId = parseData && parseData[0].teacherId._id;
    console.log("click module id ", selectedModuleId);
    console.log("teacher id ", teacherObjectId);
    console.log("Post Upload");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", date);
      // Convert time to 12-hour format with AM/PM
      const formattedTime = moment(time, "HH:mm").format("hh:mm A");
      formData.append("dueDateTime", formattedTime); // Append formatted time
      // formData.append("dueDateTime", time);
      formData.append("assignGroup", assignGroup ?? "");
      formData.append("moduleId", selectedModuleId ?? "");
      formData.append("teacherId", teacherObjectId ?? "");
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      links.forEach((link) => {
        formData.append("links", link);
      });

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      if (id) {
        try {
          const response = await axios.put(
            `http://localhost:5000/api/teacher-dashboard/module/assignment/edit/${id}`,
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Response:", response.data);
          localStorage.setItem("msg", response.data.message);
          navigate("/teacher-dashboard/module/assignment");
        } catch (err: any) {
          console.error("Error updating assignment:", err);
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/teacher-dashboard/module/assignment/create",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
        localStorage.setItem("msg", response.data.message);
        navigate("/teacher-dashboard/module/assignment");
      }
    } catch (err: any) {
      console.error("Error creating assignment:", err);
      setServerMessage(err.response.data.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLinkIconClick = () => {
    setIsLinkFormOpen(true);
  };

  const handleLinkClose = () => {
    setIsLinkFormOpen(false);
  };

  const handleLinkSubmit = () => {
    if (newLink.trim()) {
      setLinks((prevLinks) => [...prevLinks, newLink]);
      setNewLink("");
      setIsLinkFormOpen(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleRemoveFile = async (fileName: string, index: number) => {
    setServerMessage("");
    console.log("Remove file:", fileName);
    if (id) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/teacher-dashboard/module/assignment/edit/${id}/${fileName}`,
          { withCredentials: true }
        );
        console.log("Delete file response:", response.data);
        setSelectedFiles((prevFiles) =>
          prevFiles.filter((_, i) => i !== index)
        );
        setServerMessage(response.data.message);
      } catch (err) {
        console.error("Error deleting file:", err);
        setSelectedFiles((prevFiles) =>
          prevFiles.filter((_, i) => i !== index)
        );
      }
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
            <h1 className="text-[20px]">Assignment</h1>
          </div>
          <Button
            type={id ? "Save" : "Post"}
            onClick={handleCreateAssignment}
          />
        </div>

        <form action="" className="space-y-2">
          <div className="space-y-2">
            <label className="module-file-title" htmlFor="">
              Title
            </label>
            <input
              id="module-file-title"
              name="module-file-title"
              className="outline-none w-full bg-transparent border border-slate-700 p-4"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="module-file-description" htmlFor="">
              Description
            </label>
            <textarea
              placeholder="Optional"
              id="module-file-description"
              name="module-file-description"
              className="w-full bg-transparent border border-slate-700 p-4 h-[10vw] resize-none outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* File Area */}
          <div className="file-area space-y-2">
            {selectedFiles.map((file, index) => {
              // Find the last occurrence of '-' in the file name
              const lastHyphenIndex = file.name.lastIndexOf("-");
              const extensionIndex = file.name.lastIndexOf("."); // Find the position of the file extension
              const extension = file.name.slice(extensionIndex); // Get the file extension

              const displayName =
                lastHyphenIndex !== -1
                  ? file.name.slice(0, lastHyphenIndex) + extension // Keep the extension
                  : file.name; // If no hyphen is found, use the original name

              return (
                <div
                  key={index}
                  className="file-item flex justify-between items-center border border-slate-700 p-2 rounded"
                >
                  <div>{displayName}</div>
                  <X
                    size={32}
                    className="cursor-pointer"
                    onClick={() => handleRemoveFile(file.name, index)}
                  />
                </div>
              );
            })}
          </div>

          {/* Link Area */}
          <div className="link-area space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="link-item flex justify-between items-center border border-slate-700 p-2 rounded"
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

          {/* For Time */}
          <div className="date-area space-y-2">
            <label className="assign-time-label" htmlFor="">
              Due
            </label>
            <div className="flex gap-4">
              <input
                id="assign-date"
                name="assign-date"
                value={date}
                className="text-slate-400 outline-none w-full bg-transparent border border-slate-700 p-4"
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                id="assign-time"
                name="assign-time"
                value={time}
                className="text-slate-400 outline-none w-full bg-transparent border border-slate-700 p-4"
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="attach-resource border border-slate-700 p-4 rounded">
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
      {isLinkFormOpen && (
        <section className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center">
          <form
            action=""
            onSubmit={handleLinkSubmit}
            className="bg-slate-800 p-4 forLink max-w-[400px] rounded space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3>Add Link</h3>
              <X className="cursor-pointer" onClick={handleLinkClose} />
            </div>
            <input
              className="outline-none w-full bg-transparent border-b border-slate-700 p-2"
              placeholder="Link"
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <input
              type="submit"
              onClick={handleLinkSubmit}
              className="bg-green-800 px-1.5 py-1 w-full rounded"
            />
          </form>
        </section>
      )}
    </>
  );
};
