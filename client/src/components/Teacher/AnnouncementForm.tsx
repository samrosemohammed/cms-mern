import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { X, Upload, Link2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FeedBack } from "../FeedBack";

export const AnnouncementForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [description, setDescription] = useState("");
  const [announcements, setAnnouncements] = useState<any>([]);
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/teacher-dashboard/module/announcement/${id}`,
            {
              withCredentials: true,
            }
          );
          console.log("Announcement:", response.data);
          setAnnouncements(response.data.announcements);
          const { description, files, links } = response.data.announcements[0];
          setDescription(description);
          setLinks(links || []);
          const mockFiles = files.map((filePath: string) => ({
            name: filePath.split("\\").pop() || "File",
            path: filePath,
          }));

          setSelectedFiles(mockFiles);
        } catch (error) {
          console.error("Error fetching assignments:", error);
        }
      }
    };
    fetchAnnouncements();
  }, [id]);

  const handleCloseUpload = () => {
    navigate("/teacher-dashboard/module/announcement");
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

  const handleRemoveLink = (index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleRemoveFile = async (fileName: string, index: number) => {
    console.log("Remove file:", fileName);
    if (id) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/teacher-dashboard/module/announcement/edit/${id}/${fileName}`,
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

  const handleCreateAnnouncement = async () => {
    setServerMessage("");
    console.log("Create Announcement Clicked");
    const selectedModuleId = localStorage.getItem("selectedModuleId");
    const assignGroup = localStorage.getItem("assignGroup");
    const data: any = localStorage.getItem("modulesData");
    const parseData: any = JSON.parse(data);
    console.log(parseData);
    const teacherObjectId = parseData && parseData[0].teacherId._id;
    console.log("click module id ", selectedModuleId);
    console.log("teacher id ", teacherObjectId);
    console.log("Post Upload");
    const formData = new FormData();
    formData.append("description", description);
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
          `http://localhost:5000/api/teacher-dashboard/module/announcement/edit/${id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        console.log("Edit Announcement Response:", response.data);
        setServerMessage(response.data.message);
        navigate("/teacher-dashboard/module/announcement");
      } catch (err: any) {
        setServerMessage(err.response.data.message);
        console.error("Error editing announcement:", err.response.data.message);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/teacher-dashboard/module/announcement/create",
          formData,
          {
            withCredentials: true,
          }
        );
        console.log("Create Announcement Response:", response.data);

        navigate("/teacher-dashboard/module/announcement");
      } catch (err: any) {
        console.error(
          "Error creating announcement:",
          err.response.data.message
        );
        setServerMessage(err.response.data.message);
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
            <h1 className="text-[20px]">Announcement</h1>
          </div>
          <Button
            type={id ? "Save" : "Post"}
            onClick={handleCreateAnnouncement}
          />
        </div>
        <form action="" className="space-y-2">
          <div className="space-y-2">
            <label className="" htmlFor="">
              Description
            </label>
            <textarea
              id="announce-description"
              name="announce-description"
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
