import { X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FeedBack } from "./FeedBack";
import { Loader } from "./Loader";
interface FormField {
  label: string;
  type: string;
  name: string;
  id: string;
  options?: string[]; // Add options field for select type
}

interface SystemFormProps {
  fields: FormField[];
  useGrid?: boolean;
  gridNumber?: string;
  onClose: () => void;
  submitUrl?: any;
  moduleData?: any;
  option?: any;
  studentData?: any;
  teacherData?: any;
  assignModuleData?: any;
  editProfileData?: any;
  serverMessageFromForm?: (message: string) => void;
  fetchData?: () => void;
}

export const SystemForm = ({
  fields,
  useGrid,
  gridNumber,
  onClose,
  submitUrl,
  moduleData,
  option,
  studentData,
  teacherData,
  assignModuleData,
  editProfileData,
  serverMessageFromForm,
  fetchData,
}: SystemFormProps) => {
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [file, setFile] = useState<any>(null);
  const [serverMessage, setServerMessage] = useState("");
  useEffect(() => {
    setFormData(
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: moduleData
            ? moduleData[field.name] || ""
            : studentData
            ? studentData[field.name] || ""
            : teacherData
            ? teacherData[field.name] || ""
            : editProfileData
            ? editProfileData[field.name] || ""
            : "",
        }),
        {}
      )
    );
  }, [fields, moduleData, studentData, teacherData, editProfileData]);

  const serverMessageFunction = (message: string) => {
    setServerMessage(message);
  };

  // console.log("Module data:", moduleData);
  // console.log("Student data:", studentData);
  // console.log("Teacher Data", teacherData);
  // console.log("Assign Module Data", assignModuleData);
  const combinedData = { ...formData, ...moduleData };
  const editAssignData = { ...formData, ...assignModuleData };
  // console.log("for Edit Combined ", editAssignData);
  // console.log("for Assign Combined ", combinedData);

  const handleChange = (e: any) => {
    const { files, name, value } = e.target;
    if (files && files.length > 0) {
      setFile(files[0]);
      setFormData({
        ...formData,
        [name]: files[0].name, // Store the file name in formData for display
      });
    } else {
      if (name === "teacherName") {
        const selectedTeacher = teachers.find(
          (teacher: any) => teacher.teacherName === value
        );
        setFormData({
          ...formData,
          [name]: value,
          teacherId: selectedTeacher ? selectedTeacher._id : "", // Store the teacher's ID
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  // console.log(submitUrl);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    serverMessageFunction("");
    // const combinedData = { ...formData, ...moduleData };
    const editAssignData = { ...formData, ...assignModuleData };
    // console.log("Edit Assign Data", editAssignData);
    // console.log("Form submitted with data:", formData);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (file && studentData) {
      data.append("studentImage", file);
    }
    if (file && teacherData) {
      data.append("teacherImage", file);
    }

    if (file && editProfileData) {
      data.append("adminImage", file);
    }
    // console.log("from student: ", option);
    try {
      if (option === "Edit" && moduleData) {
        const response = await axios.put(submitUrl, formData, {
          withCredentials: true,
        });
        console.log("Module update data : ", response.data);
        fetchData && fetchData();

        serverMessageFromForm && serverMessageFromForm(response.data.message);
        onClose();
      } else if (editProfileData) {
        console.log("data", data);
        const response = await axios.put(submitUrl, data, {
          withCredentials: true,
        });
        console.log("Profile updated:", response.data);
        fetchData && fetchData();

        serverMessageFromForm && serverMessageFromForm(response.data.message);
        onClose();
      } else if (option === "Assign" && assignModuleData) {
        serverMessageFromForm && serverMessageFromForm("");
        const response = await axios.put(submitUrl, formData, {
          withCredentials: true,
        });
        // console.log("Assign Module Update:", response.data);

        serverMessageFromForm && serverMessageFromForm(response.data.message);
        onClose();
      } else if (studentData && option === "Edit") {
        // setIsLoading(true);
        const response = await axios.put(submitUrl, data, {
          withCredentials: true,
        });
        // console.log("Student updated:", response.data);
        fetchData && fetchData();
        // setIsLoading(false);
      } else if (teacherData && option === "Edit") {
        // console.log("Submitted URL: ", submitUrl, option);
        const response = await axios.put(submitUrl, data, {
          withCredentials: true,
        });
        // console.log("Teacher updated:", response.data);
        fetchData && fetchData();
      } else if (option === "Assign" && combinedData) {
        setIsLoading(true);
        const response = await axios.post(submitUrl, combinedData, {
          withCredentials: true,
        });
        console.log("Module assigned:", response.data);
        console.log("Assing Message : ", response.data.message);
        fetchData && fetchData();
        setIsLoading(false);
        serverMessageFunction(response.data.message);
        serverMessageFromForm && serverMessageFromForm(response.data.message);
      } else if (!studentData && !teacherData && !assignModuleData) {
        const response = await axios.post(submitUrl, formData, {
          withCredentials: true,
        });

        // console.log("Module created:", response.data);
        // console.log(
        //   "Module created response message : ",
        //   response.data.message
        // );
        fetchData && fetchData();

        // serverMessage(response.data.message);
        serverMessageFunction(response.data.message);
        serverMessageFromForm && serverMessageFromForm(response.data.message);
      } else {
        console.log(data);
        console.log(submitUrl);

        const response = await axios.post(submitUrl, data, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log("Student created:", response.data);
        serverMessageFunction(response.data.message);
        // setIsLoading(false);
      }
      onClose();
      fetchData && fetchData();
      setIsLoading(false);
      // setServerMessage("Data submitted successfully");
    } catch (err: any) {
      console.error("Error creating student:", err);
      console.log("Error : ", err.response.data.message);
      serverMessageFunction(err.response.data.message || "An error occured");
      // setServerMessage(err.response.data.message || "An error occurred");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin-dashboard/teacher",
        {
          withCredentials: true,
        }
      );
      setTeachers(res.data);
      // console.log(res.data); // Log the fetched student data
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin-dashboard/student",
        {
          withCredentials: true,
        }
      );
      setStudents(res.data);
      // console.log(res.data); // Log the fetched student data
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/user-details",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      console.log(res.data);
      // Update form data with the fetched user details
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        ...res.data, // Assuming res.data contains the user details with keys matching the form fields
      }));
    } catch (err: any) {
      console.error("Error:", err.response.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchUserDetails();
  }, []);

  const formContent = fields.map((field, index) => {
    return (
      <div key={index}>
        <label className="inline-block mb-2" htmlFor={field.id}>
          {field.label}
        </label>
        {field.type === "select" ? (
          <select
            className="text-slate-300 w-full rounded px-2 py-1 mb-2 bg-slate-700 cursor-pointer"
            name={field.name}
            id={field.id}
            onChange={handleChange}
            value={formData[field.name]}
            required
          >
            {field.id === "teacherName" && (
              <>
                <option value="">Select Teacher</option>
                {teachers.map((teacher: any) => (
                  <option key={teacher._id} value={teacher.teacherName}>
                    {teacher.teacherName}
                  </option>
                ))}
              </>
            )}
            {field.id === "assignGroup" && (
              <>
                <option value="">Select Group</option>
                {(() => {
                  const groupSet = new Set();
                  return students
                    .filter((student: any) => {
                      const group = student.studentGroup;
                      if (!groupSet.has(group)) {
                        groupSet.add(group);
                        return true;
                      }
                      return false;
                    })
                    .map((student: any) => (
                      <option key={student._id} value={student.studentGroup}>
                        {student.studentGroup}
                      </option>
                    ));
                })()}
              </>
            )}
          </select>
        ) : (
          <>
            <input
              className="w-full rounded px-2 py-1 mb-2 bg-slate-700"
              type={field.type}
              name={field.name}
              id={field.id}
              onChange={handleChange}
              {...(field.type !== "file" && { value: formData[field.name] })}
            />
            {field.type === "file" && formData[field.name] && (
              <p className="text-sm text-gray-300">{formData[field.name]}</p>
            )}
          </>
        )}
      </div>
    );
  });

  const gridClass = useGrid ? `grid grid-cols-${gridNumber} gap-4` : "";
  return (
    <>
      {isLoading && <Loader />}
      {serverMessage && (
        <FeedBack key={serverMessage} message={serverMessage} />
      )}
      <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-[998]">
        <section
          className={`${
            useGrid ? "max-w-[850px]" : "max-w-[400px]"
          } bg-slate-800 p-4 rounded relative`}
        >
          <form
            className={`bg-slate-800 p-4 space-y-3 `}
            action=""
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between">
              <div></div>
              <button type="button" onClick={onClose}>
                <X size={28} />
              </button>
            </div>
            <div className={gridClass}>{formContent}</div>
            <div></div>
            <input
              className="cursor-pointer w-full rounded px-2 py-1 bg-green-700 hover:bg-green-800"
              type="submit"
            />
          </form>
        </section>
      </div>
    </>
  );
};
