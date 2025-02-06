import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import defaultImage from "../assets/default-image.png";

interface ViewGroupStudentProps {
  onClose: () => void;
  group: string;
}

const ViewGroupStudent = ({ onClose, group }: ViewGroupStudentProps) => {
  const [students, setStudents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const handleModuleChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = {
      ...newSelectedOptions[index],
      selectedModule: event.target.value,
    };
    setSelectedOptions(newSelectedOptions);
  };

  const handleGroupChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = {
      ...newSelectedOptions[index],
      selectedGroup: event.target.value,
    };
    setSelectedOptions(newSelectedOptions);
  };

  console.log(selectedOptions, group);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin-dashboard/assign/${group}`,
        {
          withCredentials: true,
        }
      );
      setStudents(res.data);

      setIsLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <section className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-[998] bg-gray-900">
        <div className="p-4 max-w-screen-xl overflow-auto max-h-[580px] overflow-y-auto shadow-md sm:rounded bg-gray-800">
          <div className="flex justify-end mb-4">
            <X onClick={onClose} className="cursor-pointer" size={32} />
          </div>
          <table className={`w-full text-xl text-left rtl:text-right`}>
            <thead className={`text-[12px] uppercase`}>
              <tr>
                <th scope="" className="px-6 py-1">
                  Module Code
                </th>
                <th scope="" className="px-6 py-1">
                  Module Name
                </th>
                <th scope="" className="px-6 py-1">
                  Student ID
                </th>
                <th scope="" className="px-6 py-1">
                  Student Name
                </th>
                <th scope="" className="px-6 py-1">
                  Student Email
                </th>
                <th scope="" className="px-6 py-1">
                  Student Group
                </th>
                <th scope="" className="px-6 py-1">
                  Student Course
                </th>
                <th scope="" className="px-6 py-1">
                  Student Image
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {students.map((student: any, index: number) => (
                <tr className="border-b border-gray-700" key={student._id}>
                  <th
                    scope="row"
                    className={`px-6 py-4 font-medium whitespace-nowrap`}
                  >
                    02
                  </th>
                  <td className="px-6 py-4">
                    <select
                      className="bg-gray-700 w-full"
                      value={selectedOptions[index]?.selectedModule || "Fyp"}
                      onChange={(event) => handleModuleChange(index, event)}
                    >
                      <option value="Default">Default</option>
                      <option value="Fyp">Fyp</option>
                      <option value="Module1">Module1</option>
                      <option value="Module2">Module2</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">{student.studentID}</td>
                  <td className="px-6 py-4">{student.studentName}</td>
                  <td className="px-6 py-4">{student.studentEmail}</td>
                  <td className="px-6 py-4">
                    <select
                      className="bg-gray-700 w-full"
                      value={selectedOptions[index]?.selectedGroup || "A"}
                      onChange={(event) => handleGroupChange(index, event)}
                    >
                      <option value="Default">Default</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">{student.studentCourseSelected}</td>
                  <td className="px-6 py-4">
                    <img
                      className={`object-cover w-[48px] h-[48px] rounded-full p-1`}
                      src={
                        student?.studentImage
                          ? `http://localhost:5000/uploads/${student.studentImage}`
                          : defaultImage
                      }
                      alt="Image"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-end mt-4">
            <button className="bg-green-800 hover:bg-green-700 px-4 py-1 rounded">
              Save
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewGroupStudent;
