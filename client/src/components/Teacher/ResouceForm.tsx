import React, { useRef, useState, useEffect } from "react";
import { Button } from "../Button";
import { Upload, Link2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FeedBack } from "../FeedBack";
import { useTheme } from "../../utlis/ThemeContext";

interface ResourceFormProps {
  data?: any;
}
export const ResourceForm = ({ data }: ResourceFormProps) => {
  // const { id } = useParams();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");
  const { id } = useParams();

  // console.log("Resource id ", id);

  useEffect(() => {
    const fetchModuleResources = async () => {
      try {
        if (id) {
          console.log("id from resource useEffect: ", id);
          const response = await axios.get(
            `http://localhost:5000/api/teacher-dashboard/module/file/edit/${id}`,
            {
              withCredentials: true,
            }
          );
          console.log("Module Edit Resources:", response.data.resources);

          const resourceData = response.data.resources[0];
          if (resourceData) {
            const { title, description, files, links } = resourceData;
            console.log("Files", files);
            setTitle(title || "");
            setDescription(description || "");
            setLinks(links || []);

            // Create a mock object for each file path to be used in the UI
            const mockFiles = files.map((filePath: string) => ({
              name: filePath.split("\\").pop() || "File",
              path: filePath,
            }));

            setSelectedFiles(mockFiles);
          }
        }
      } catch (err) {
        console.error("Error fetching module resources:", err);
      }
    };

    fetchModuleResources();
  }, [id]); // Add `id` as a dependency

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = async (fileName: string, index: number) => {
    console.log("Remove file:", fileName);
    if (id) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/teacher-dashboard/module/file/edit/${id}/${fileName}`,
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
    // setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleLinkIconClick = () => {
    setIsLinkFormOpen(true);
  };

  const handleLinkClose = () => {
    setIsLinkFormOpen(false);
  };

  const handleCloseUpload = () => {
    navigate("/teacher-dashboard/module/file");
  };

  const handleLinkSubmit = (e: any) => {
    e.preventDefault();
    setServerMessage("");

    // Basic URL validation regex pattern
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

    if (!urlPattern.test(newLink)) {
      setServerMessage("Invalid URL");
      return; // Prevent form submission if the URL is invalid
    }

    if (newLink.trim()) {
      setLinks((prevLinks) => [...prevLinks, newLink]);
      setNewLink("");
      setIsLinkFormOpen(false);
    }
  };

  const handlePostUpload = async (e: any) => {
    e.preventDefault();
    setServerMessage("");
    const selectedModuleId = localStorage.getItem("selectedModuleId");
    const assignGroup = localStorage.getItem("assignGroup");
    const data: any = localStorage.getItem("modulesData");
    const parseData: any = JSON.parse(data);
    console.log(parseData);
    const teacherObjectId = parseData && parseData[0].teacherId._id;
    console.log("click module id ", selectedModuleId);
    console.log("teacher id ", teacherObjectId);
    try {
      console.log("Teacher", "");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("assignGroup", assignGroup ?? "");
      formData.append("moduleId", selectedModuleId ?? ""); // Assuming `id` is the moduleId
      formData.append("teacherId", teacherObjectId); // Replace with actual teacherId

      // Append each file to the FormData
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      links.forEach((link) => {
        formData.append("links", link);
      });

      // Log the FormData content
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      if (id) {
        const response = await axios.put(
          `http://localhost:5000/api/teacher-dashboard/module/file/edit/${id}`,
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
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/teacher-dashboard/module/file/upload",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
        // console.log(response.data.message);
        localStorage.setItem("msg", response.data.message);
      }

      navigate("/teacher-dashboard/module/file"); // Redirect after successful upload
    } catch (err: any) {
      console.error("Error posting resource data:", err);
      setServerMessage(err.response.data.message);
    }
  };

  console.log("Message from the server: ", serverMessage);
  const handleRemoveLink = (index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
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
            <h1 className="text-[20px]">Resources</h1>
          </div>
          <Button type={id ? "Save" : "Post"} onClick={handlePostUpload} />
        </div>

        <form action="" className="space-y-2">
          <div className="space-y-2">
            <label className="module-file-title" htmlFor="">
              Title
            </label>
            <input
              id="module-file-title"
              name="module-file-title"
              className={`${
                theme === "dark" ? "dark:border-slate-700" : "border-slate-300"
              } outline-none w-full bg-transparent border p-4 rounded`}
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
              id="module-file-description"
              name="module-file-description"
              className={`${
                theme === "dark" ? "dark:border-slate-700" : "border-slate-300"
              } w-full bg-transparent border  p-4 h-[10vw] resize-none outline-none rounded`}
              value={description}
              placeholder="Optional"
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
                  className={`${
                    theme === "dark"
                      ? "dark:border-slate-700"
                      : "border-slate-300"
                  } file-item flex justify-between items-center border  p-2 rounded`}
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
                className={`${
                  theme === "dark"
                    ? "dark:border-slate-700 "
                    : "border-slate-300"
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
              theme === "dark" ? "dark:border-slate-700 " : "border-slate-300"
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
