import axios from "axios";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import moment from "moment";
import { useTheme } from "../../utlis/ThemeContext";
export const File = () => {
  const [resources, setResources] = useState<any>([]);
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

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
      // Extract the original file name (before the timestamp)
      const fullName = fileName.replace(/^uploads\\/, ""); // Remove the 'uploads\' part
      const originalName = fullName.split("-")[0]; // Get the part before the timestamp
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

  return (
    <>
      <section>
        <div className="resource-container">
          <ol className="space-y-8">
            {resources.map((resource: any) => (
              <li
                key={resource._id}
                className={`${
                  theme === "dark" ? "dark:border-slate-600" : "border-gray-300"
                } border-b p-4 rounded`}
              >
                <div className="flex justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bookmark />
                    <p className="dynamic-week-header">{resource.title}</p>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <p className="text-[14px]">
                      Posted
                      <span className="ml-2">
                        {moment(resource.createdAt).year() === currentYear
                          ? moment(resource.createdAt).format("MMM D, hh:mm A")
                          : moment(resource.createdAt).format("YYYY, MMM D")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="dynamic-description mb-4">
                    {resource.description}
                  </p>
                  <div className="file-container grid grid-cols-4 gap-4">
                    {resource.files?.map((file: string, index: number) => {
                      // Extract the filename with the extension
                      const fullName = file.replace(/^uploads\\/, ""); // Remove the 'uploads\' part
                      const originalName = fullName.split("-")[0]; // Get the part before the timestamp
                      const extension = fullName.split(".").pop(); // Get the file extension

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

                    {resource.links?.map((link: string, index: number) => (
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
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
};
