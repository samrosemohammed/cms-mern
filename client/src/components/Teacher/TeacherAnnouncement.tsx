import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bookmark, EllipsisVertical, Minus } from "lucide-react";
import axios from "axios";
import moment from "moment";
export const TeacherAnnouncement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<any>([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const handleCreateAnnouncement = () => {
    console.log("Create Announcement Clicked");
    navigate("/teacher-dashboard/module/announcement/create");
  };

  const handleOption = (assignmentId: any) => {
    console.log("Option Clicked", assignmentId);
    setSelectedAnnouncementId((prev) =>
      prev === assignmentId ? null : assignmentId
    );
  };

  const handleDeleteAnnouncement = async (announceObjectId: any) => {
    console.log("Delete Clicked");
    console.log("Announce Object ID:", announceObjectId);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/teacher-dashboard/module/announcement/${announceObjectId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data.message);
      fetchAnnouncements();
      navigate("/teacher-dashboard/module/announcement");
    } catch (err: any) {
      console.error("Error deleting resource:", err);
    }
  };

  const handleEditAnnouncement = (announcementId: any) => {
    console.log("Edit Assignment Clicked", announcementId);
    navigate(`/teacher-dashboard/module/announcement/edit/${announcementId}`);
  };

  const fetchAnnouncements = async () => {
    try {
      const moduleId = localStorage.getItem("selectedModuleId");
      const assignGroup = localStorage.getItem("assignGroup");
      console.log("Module ID:", moduleId);
      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/announcement/${moduleId}/${assignGroup}`,
        {
          withCredentials: true,
        }
      );
      console.log("Announcement:", response.data);
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleFileDownload = async (fileName: string) => {
    console.log("File Downloaded", fileName);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/teacher-dashboard/module/announcement/download/${fileName}`,
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

  const currentYear = new Date().getFullYear();
  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-8">
          <h1 className="tracking-wider text-[18px] text-slate-300 border-b inline-block border-green-400 capitalize">
            Announcement
          </h1>
          <Button
            onClick={handleCreateAnnouncement}
            type={"Create Announcement"}
          />
        </div>

        <ol className="space-y-8">
          {announcements.map((announcement: any) => (
            <li
              className="border-b border-slate-600 p-4 rounded"
              key={announcement._id}
            >
              <div className="flex justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bookmark />
                  <p className="dynamic-week-header">
                    {announcement.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 relative">
                  <p className="text-slate-400 text-[14px]">
                    Posted
                    <span className="ml-2">
                      {moment(announcement.createdAt).year() === currentYear
                        ? moment(announcement.createdAt).format("MMM D")
                        : moment(announcement.createdAt).format("YYYY MMM D")}
                    </span>
                  </p>
                  <EllipsisVertical
                    onClick={() => handleOption(announcement._id)}
                    className="cursor-pointer hover:bg-slate-800 rounded-full"
                  />
                  {selectedAnnouncementId === announcement._id && (
                    <div className="absolute top-8 right-3 bg-slate-800 rounded">
                      <ul className="space-y-2">
                        <li
                          className="hover:bg-slate-700 py-1.5 px-4 cursor-pointer"
                          onClick={() =>
                            handleEditAnnouncement(announcement._id)
                          }
                        >
                          Edit
                        </li>
                        <li
                          className="hover:bg-slate-700 py-1.5 px-4 cursor-pointer"
                          onClick={() =>
                            handleDeleteAnnouncement(announcement._id)
                          }
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="file-container grid grid-cols-4 gap-4">
                {announcement.files?.map((file: string, index: number) => (
                  <p
                    key={index}
                    title={file ? file.split("-").pop() : "No file available"}
                    onClick={() => handleFileDownload(file)}
                    className="cursor-pointer dynamic-file-name border border-slate-700 p-4 rounded hover:bg-slate-800 truncate whitespace-nowrap overflow-hidden"
                  >
                    {file.split("-").pop()}
                  </p>
                ))}

                {announcement.links?.map((link: string, index: number) => (
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

              <div className="mt-3 text-slate-400 text-[14px] flex justify-between items-center">
                <div></div>
                <p className="dynamic-author-name flex gap-2 items-center">
                  <Minus size={18} /> {announcement.teacherId.teacherName}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};
