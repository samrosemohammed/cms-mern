import { Button } from "../../components/Button";
import { Link2, Folder, Bookmark, EllipsisVertical, Album } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const TeacherModuleFile = () => {
  const [resources, setResources] = useState<any>([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const navigate = useNavigate();

  const handleEditResource = (resourceObjectId: any) => {
    console.log("Edit Clicked");
    console.log("Resource Object ID:", resourceObjectId);
    navigate(`/teacher-dashboard/module/file/edit/${resourceObjectId}`);
  };

  const handleDeleteResource = async (resourceObjectId: any) => {
    console.log("Delete Clicked");
    console.log("Resource Object ID:", resourceObjectId);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/teacher-dashboard/module/file/${resourceObjectId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data.message);
      fetchModuleResources();
      navigate("/teacher-dashboard/module/file");
    } catch (err: any) {
      console.error("Error deleting resource:", err);
    }
  };

  const handleOption = (resourceId: any) => {
    console.log("Option Clicked");
    setSelectedResourceId((prev) => (prev === resourceId ? null : resourceId));
  };

  const handleUploadClick = () => {
    console.log("Upload Clicked");
    navigate("/teacher-dashboard/module/file/upload");
  };

  const handleFileDownload = async (fileName: string) => {
    console.log("File Downloaded");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/file/${fileName}`,
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

  const fetchModuleResources = async () => {
    try {
      const moduleId = localStorage.getItem("selectedModuleId");
      const assignGroup = localStorage.getItem("assignGroup");
      console.log("Module ID:", moduleId);
      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/file/${moduleId}/${assignGroup}`,
        {
          withCredentials: true,
        }
      );
      console.log("Module Resources:", response.data);
      setResources(response.data.resources);
    } catch (err: any) {
      console.error("Error fetching module resources:", err);
    }
  };
  useEffect(() => {
    fetchModuleResources();
  }, []);

  console.log("Resources:", resources);
  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-8">
          <h1 className="tracking-wider text-[18px] text-slate-300 border-b inline-block border-green-400 capitalize">
            teacher's content
          </h1>
          <Button onClick={handleUploadClick} type={"Upload Resource"} />
        </div>
        <div className="resource-container">
          <ol className="space-y-8">
            {resources.map((resource: any) => (
              <li
                key={resource._id}
                className="border-b border-slate-600 p-4 rounded"
              >
                <div className="flex justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bookmark />
                    <p className="dynamic-week-header">{resource.title}</p>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <p>{new Date(resource.createdAt).toLocaleTimeString()}</p>
                    <EllipsisVertical
                      onClick={() => handleOption(resource._id)}
                      className="cursor-pointer hover:bg-slate-800 rounded-full"
                    />
                    {selectedResourceId === resource._id && (
                      <div className="absolute top-8 right-3 bg-slate-800 rounded">
                        <ul className="space-y-2">
                          <li
                            className="hover:bg-slate-700 py-1.5 px-4 cursor-pointer"
                            onClick={() => handleEditResource(resource._id)}
                          >
                            Edit
                          </li>
                          <li
                            className="hover:bg-slate-700 py-1.5 px-4 cursor-pointer"
                            onClick={() => handleDeleteResource(resource._id)}
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="">
                  <p className="dynamic-description mb-4">
                    {resource.description}
                  </p>
                  <div className="file-container grid grid-cols-4 gap-4">
                    {resource.files?.map((file: string, index: number) => (
                      <p
                        key={index}
                        title={
                          file ? file.split("-").pop() : "No file available"
                        }
                        onClick={() => handleFileDownload(file)}
                        className="cursor-pointer dynamic-file-name border border-slate-700 p-4 rounded hover:bg-slate-800 truncate whitespace-nowrap overflow-hidden"
                      >
                        {file.split("-").pop()}
                      </p>
                    ))}

                    {resource.links?.map((link: string, index: number) => (
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
