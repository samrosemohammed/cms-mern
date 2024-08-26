import { Button } from "./Button";
import { SearchEngine } from "./SearchEngine";
import { SystemForm } from "./SystemForm";
// import moduleBanner from "../assets/ankit-developer.jpg"; // Adjust the path as necessary
import defaultImage from "../assets/default-image.png";
import { FeedBack } from "./FeedBack";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Loader } from "./Loader";

export const AdminStudent = () => {
  const studentFields = [
    {
      label: "Student Name",
      type: "text",
      name: "studentName",
      id: "studentName",
    },
    { label: "Student ID", type: "text", name: "studentID", id: "studentID" },
    { label: "Email", type: "text", name: "studentEmail", id: "studentEmail" },
    {
      label: "Password",
      type: "password",
      name: "studentPassword",
      id: "studentPassword",
    },
    {
      label: "Course Selected",
      type: "text",
      name: "studentCourseSelected",
      id: "studentCourseSelected",
    },
    {
      label: "Group",
      type: "text",
      name: "studentGroup",
      id: "studentGroup",
    },
    {
      label: "Mobile No",
      type: "text",
      name: "studentMobileNo",
      id: "studentMobileNo",
    },
    {
      label: "Date",
      type: "date",
      name: "studentStartYear",
      id: "studentStartYear",
    },
    {
      label: "End Date",
      type: "date",
      name: "studentEndYear",
      id: "studentEndYear",
    },
    {
      label: "Upload Image",
      type: "file",
      name: "studentImage",
      id: "studentImage",
    },
  ];

  const [isFormVisible, setFormVisible] = useState(false);
  const [students, setStudents] = useState<any>([]);
  const [clickedStudents, setClickedStudents] = useState<any>({});
  const [option, setOption] = useState("");
  const [serverMessage, setSeverMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoding, setIsLoading] = useState(true);

  const handleSearchInput = (event: any) => {
    setSearchQuery(event.target.value);
  }; // console.log(students);

  const handleAddStudent = () => {
    setClickedStudents({});
    setOption("");
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin-dashboard/student",
        {
          withCredentials: true,
        }
      );
      setStudents(res.data);
      setIsLoading(false);
      // console.log(res.data); // Log the fetched student data
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleEdit = (clickStudentData: any) => {
    setOption("Edit");
    setClickedStudents({
      ...clickStudentData,
      studentStartYear: moment(clickStudentData.studentStartYear).format(
        "YYYY-MM-DD"
      ),
      studentEndYear: moment(clickStudentData.studentEndYear).format(
        "YYYY-MM-DD"
      ),
    });
    setFormVisible(true);
  };

  const takeOutYear = (date: string) => {
    const time = moment(date).format("HH:mm");
    console.log(time);
    return date.split("-")[0];
  };

  console.log("Clicked Student Data:", clickedStudents._id);
  const editUrl = `http://localhost:5000/api/admin-dashboard/student/${clickedStudents._id}`;
  const createUrl = "http://localhost:5000/api/admin-dashboard/student";
  const submitUrl = option === "Edit" ? editUrl : createUrl;

  console.log("option: ", option);

  const handleDeleteStudent = async (clickStudentData: any) => {
    setIsLoading(true);
    const url = `http://localhost:5000/api/admin-dashboard/student/${clickStudentData._id}`;
    // setOption("Edit");
    setClickedStudents(clickStudentData);
    console.log(clickStudentData);
    try {
      await axios
        .delete(url, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
        });
      console.log("Student deleted successfully");
      fetchStudents();
      setIsLoading(false);
      // Optionally, refresh the module list or provide feedback to the user
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on the search query
  const filteredStudents = students.filter(
    (student: any) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentCourseSelected
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.studentGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentMobileNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isLoding && <Loader />}
      {serverMessage && <FeedBack message={serverMessage} />}

      {isFormVisible && (
        <SystemForm
          fields={studentFields}
          useGrid={true}
          gridNumber={"3"}
          onClose={handleCloseForm}
          submitUrl={submitUrl}
          studentData={clickedStudents}
          option={option}
          fetchData={fetchStudents}
          serverMessageFromForm={setSeverMessage}
        />
      )}
      <section className="">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-4">
            <SearchEngine onSearchInput={handleSearchInput} />
            <Button onClick={handleAddStudent} type="Add Student" />
          </div>
        </div>
        <div className="max-w-screen-xl  overflow-x-auto shadow-md sm:rounded">
          <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-[12px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="" className="px-6 py-1">
                  Student ID
                </th>
                <th scope="" className="px-6 py-1">
                  Student Name
                </th>
                <th scope="" className="px-6 py-1">
                  Student Email
                </th>
                {/* <th scope="" className="px-6 py-1">
                  Student Password
                </th> */}
                <th scope="" className="px-6 py-1">
                  Course
                </th>
                <th scope="" className="px-6 py-1">
                  Group
                </th>
                <th scope="" className="px-6 py-1">
                  Phone
                </th>
                <th scope="" className="px-6 py-1">
                  Image
                </th>
                <th scope="" className="px-6 py-1">
                  Start Date
                </th>
                <th scope="" className="px-6 py-1">
                  End Date
                </th>

                <th scope="" className="px-6 py-1">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {filteredStudents.map((student: any) => (
                <tr
                  key={student._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {student.studentID}
                  </th>
                  <td className="px-6 py-4">{student.studentName}</td>
                  <td className="px-6 py-4">{student.studentEmail}</td>
                  <td className="px-6 py-4">{student.studentCourseSelected}</td>
                  <td className="px-6 py-4">{student.studentGroup}</td>
                  <td className="px-6 py-4">{student.studentMobileNo}</td>
                  <td className="px-6 py-4 ">
                    <img
                      className="object-cover w-[48px] h-[48px] rounded-full bg-slate-700 p-1"
                      src={
                        student?.studentImage
                          ? `http://localhost:5000/uploads/${student.studentImage}`
                          : defaultImage
                      }
                      alt="Image"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {takeOutYear(student.studentStartYear)}
                  </td>
                  <td className="px-6 py-4">
                    {takeOutYear(student.studentEndYear)}
                  </td>
                  <td className="px-0 py-6 flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(student)}
                      className="edit-teacher-btn ml-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student)}
                      className="ml-2 font-medium text-red-600 dark:text-red-500 hover:underline delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
