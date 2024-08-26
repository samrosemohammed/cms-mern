import axios from "axios";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
export const File = () => {
  const [resources, setResources] = useState<any>([]);

  useEffect(() => {
    const fetchModuleResources = async () => {
      try {
        const moduleId = localStorage.getItem("selectedModuleId");
        //   const assignGroup = localStorage.getItem("assignGroup");
        console.log("Module ID:", moduleId);
        const response = await axios.get(
          `http://localhost:5000/api/student-dashboard/module/file/${moduleId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Module Resources:", response.data);
        setResources(response.data);
      } catch (err: any) {
        console.error("Error fetching module resources:", err);
      }
    };
    fetchModuleResources();
  }, []);

  const handleFileDownload = async (fileName: string) => {
    console.log("File Downloaded", fileName);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/student-dashboard/module/file/${fileName}`,
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

  return (
    <>
      <section>
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
