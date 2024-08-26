import { Button } from "./Button";
import { SearchEngine } from "./SearchEngine";
import { SystemForm } from "./SystemForm";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "./Loader";
import defaultImage from "../assets/default-image.png";
export const AdminTeacher = () => {
  const [isFormVisibile, setFormVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clickedTeachers, setClickedTeachers] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [option, setOption] = useState("");
  const editUrl = `http://localhost:5000/api/admin-dashboard/teacher/${clickedTeachers._id}`;
  const createUrl = "http://localhost:5000/api/admin-dashboard/teacher";
  const submitUrl = option === "Edit" ? editUrl : createUrl;
  const teacherFields = [
    {
      label: "Teacher Name",
      type: "text",
      name: "teacherName",
      id: "teacherName",
    },
    { label: "Teacher ID", type: "text", name: "teacherID", id: "teacherID" },
    {
      label: "Teacher Email",
      type: "text",
      name: "teacherEmail",
      id: "teacherEmail",
    },
    {
      label: "Teacher Password",
      type: "password",
      name: "teacherPassword",
      id: "teacherPassword",
    },
    {
      label: "Course",
      type: "text",
      name: "teacherCourse",
      id: "teacherCourse",
    },
    {
      label: "Mobile No",
      type: "text",
      name: "teacherMobileNo",
      id: "teacherMobileNo",
    },
    {
      label: "Upload Image",
      type: "file",
      name: "teacherImage",
      id: "teacherImage",
    },
  ];

  console.log("Submit URL", submitUrl);

  const handleAddTeacher = () => {
    setClickedTeachers({});
    setOption("");
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  const handleEditTeacher = (clickedTeacherData: any) => {
    setOption("Edit");
    setClickedTeachers(clickedTeacherData);
    console.log(clickedTeacherData);
    console.log("edit teacher");
    setFormVisible(true);
  };

  // Filter students based on the search query
  const filteredTeachers = teachers.filter(
    (teacher: any) =>
      teacher.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherCourse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // teacher.teacherGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherMobileNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(clickedTeachers);

  const handleDeleteTeacher = async (clickedTeacherData: any) => {
    const url = `http://localhost:5000/api/admin-dashboard/teacher/${clickedTeacherData._id}`;
    setClickedTeachers(clickedTeacherData);
    try {
      await axios
        .delete(url, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
        });
      console.log("Taecher deleted successfully");
      fetchTeachers();
    } catch (err: any) {
      console.error("Error deleting student:", err);
    }
  };
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin-dashboard/teacher",
        {
          withCredentials: true,
        }
      );
      setTeachers(res.data);
      console.log(res.data); // Log the fetched student data
      setIsLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearchInput = (event: any) => {
    setSearchQuery(event.target.value);
  }; // console.log(students);

  return (
    <>
      {isLoading && <Loader />}
      <section className="">
        {isFormVisibile && (
          <SystemForm
            fields={teacherFields}
            useGrid={true}
            gridNumber={"3"}
            onClose={handleCloseForm}
            submitUrl={submitUrl}
            teacherData={clickedTeachers}
            option={option}
            fetchData={fetchTeachers}
          />
        )}
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-4">
            <SearchEngine onSearchInput={handleSearchInput} />
            <Button onClick={handleAddTeacher} type="Add Teacher" />
          </div>
        </div>
        <div className=" max-w-screen-xl  overflow-x-auto shadow-md sm:rounded">
          <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-[12px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="" className="px-6 py-1">
                  Teacher ID
                </th>

                <th scope="" className="px-6 py-1">
                  Teacher Name
                </th>
                <th scope="" className="px-6 py-1">
                  Teacher Email
                </th>
                <th scope="" className="px-6 py-1">
                  Course
                </th>
                <th scope="" className="px-6 py-1">
                  Phone
                </th>
                <th scope="" className="px-6 py-1">
                  Image
                </th>
                <th scope="" className="px-6 py-1">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {filteredTeachers.map((teacher: any) => {
                return (
                  <tr
                    key={teacher._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {teacher.teacherID}
                    </th>
                    <td className="px-6 py-4">{teacher.teacherName}</td>
                    <td className="px-6 py-4">{teacher.teacherEmail}</td>
                    <td className="px-6 py-4">{teacher.teacherCourse}</td>
                    <td className="px-6 py-4">{teacher.teacherMobileNo}</td>
                    <td className="px-6 py-4 ">
                      <img
                        className="object-cover w-[48px] h-[48px] rounded-full bg-slate-700 p-1"
                        src={
                          teacher?.teacherImage
                            ? `http://localhost:5000/uploads/${teacher.teacherImage}`
                            : defaultImage
                        } // Adjust path as needed
                        alt="Image"
                      />
                    </td>{" "}
                    <td className="px-0 py-6 flex items-center gap-1">
                      <button
                        onClick={() => handleEditTeacher(teacher)}
                        className="edit-teacher-btn ml-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher)}
                        className="ml-2 font-medium text-red-600 dark:text-red-500 hover:underline delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
