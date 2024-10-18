import { useTheme } from "../utlis/ThemeContext";
import { Pencil, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import defaultImage from "../assets/default-image.png";
import { FeedBack } from "./FeedBack";
export const AdminSettings = () => {
  const { theme } = useTheme();
  const [userDetails, setUserDetails] = useState<any>();
  const [fullName, setFullName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] =
    useState(false);
  const [currentPasswordForPass, setCurrentPasswordForPass] =
    useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState<string>("");
  const [serverMessage, setServerMessage] = useState<string>("");

  const imgUrl =
    userDetails?.teacherImage !== null
      ? `http://localhost:5000/uploads/${userDetails?.image}`
      : defaultImage;

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/user-details",
        {
          withCredentials: true,
        }
      );
      console.log("User details fetched ", res.data);
      setUserDetails(res.data);
    } catch (err: any) {
      console.error("Error:", err.response.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleChangeEmail = () => {
    console.log("Change Email Clicked");
  };

  const handleChangePassword = () => {
    console.log("Change Password Clicked");
    setIsChangePasswordFormVisible(true);
  };

  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    setServerMessage("");
    const data = { currentPasswordForPass, newPassword, reEnterNewPassword };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin-dashboard/settings/change-password/${userDetails._id}`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Response admin : ", response.data);
        // Reset the form states after successful response
        setServerMessage(response.data.message);
        setCurrentPasswordForPass("");
        setNewPassword("");
        setReEnterNewPassword("");
        setIsChangePasswordFormVisible(false);
      }
    } catch (err: any) {
      console.error("Error:", err.response.data);
      setServerMessage(err.response.data.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setSelectedFile([file]); // Update the selected file state
      reader.onload = () => {
        setSelectedImage(reader.result as string); // Update the image state with the selected image
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  const handleEditImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  return (
    <>
      {serverMessage && <FeedBack message={serverMessage} />}
      <section className="max-w-screen-lg mt-8">
        <div className="flex gap-8">
          <form action="" className="settings-form flex-1 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="full-name"
                className={`${
                  theme === "dark" ? "dark:text-slate-300" : "text-gray-500"
                }`}
              >
                Full Name
              </label>
              <input
                className={`${
                  theme === "dark"
                    ? "dark:bg-slate-800 dark:text-slate-400"
                    : "bg-gray-200 text-gray-500"
                } w-full rounded px-4 py-3 mb-2 outline-none`}
                type="text"
                placeholder={userDetails && userDetails.name}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="full-name"
                className={`${
                  theme === "dark" ? "dark:text-slate-300" : "text-gray-500"
                }`}
              >
                Email
              </label>
              <input
                className={`${
                  theme === "dark"
                    ? "dark:bg-slate-800 dark:text-slate-400"
                    : "bg-gray-200 text-gray-500"
                } w-full rounded px-4 py-3 mb-2 `}
                type="text"
                placeholder={userDetails && userDetails.email}
                disabled
              />
              <p className="text-slate-500">
                Your primary email address. Want to change email address{" "}
                <span
                  onClick={handleChangeEmail}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  click here
                </span>
              </p>
            </div>
            <p
              className={`${
                theme === "dark" ? "dark:text-slate-300" : "text-gray-500"
              }`}
            >
              Want to change your password{" "}
              <span
                onClick={handleChangePassword}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                click here
              </span>
            </p>
          </form>
          <div className="for-image-content">
            <div className="relative ">
              <div
                className={`${
                  theme === "dark" ? "dark:bg-slate-700" : "bg-gray-300"
                } rounded-full p-2 absolute -right-2 -top-1 cursor-pointer`}
                title="Edit Image"
                onClick={handleEditImageClick}
              >
                <Pencil
                  size={18}
                  className={`${
                    theme === "dark" ? "dark:text-slate-300" : "text-slate-500"
                  } `}
                />
              </div>
              <div className="group">
                <img
                  className="w-[90px] h-[90px] object-cover rounded-full border border-slate-400"
                  src={selectedImage || imgUrl}
                  alt="User"
                />
                <button
                  className={`${
                    theme === "dark"
                      ? "dark:bg-red-800 dark:text-slate-300"
                      : "bg-red-100 text-red-600"
                  } text-[14px] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full py-1 px-3 rounded-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}
                  //   onClick={handleRemoveImage}
                >
                  Remove
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <button
          //   onClick={handleSaveChanges}
          className={`${
            theme === "dark"
              ? "dark:bg-green-800 dark:text-slate-300"
              : "bg-green-200 text-green-900"
          } mt-6  px-2 py-0.5 rounded`}
        >
          Save Changes
        </button>
      </section>

      {isChangePasswordFormVisible && (
        <section
          className={`${
            theme === "dark" ? "bg-slate-900" : "bg-[#00000055]"
          } fixed inset-0 bg-opacity-80 flex items-center justify-center text-slate-300`}
        >
          <form
            action=""
            className={`${
              theme === "dark" ? "dark:bg-slate-800" : "bg-white text-gray-600"
            } for-password-change max-w-screen-sm p-4 rounded space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div></div>
              <X
                onClick={() => setIsChangePasswordFormVisible(false)}
                size={28}
                className={`${
                  theme === "dark"
                    ? "dark:hover:bg-slate-700"
                    : "hover:bg-gray-100"
                } cursor-pointer rounded`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="">Password</label>
              <input
                className={`${
                  theme === "dark" ? "dark:bg-slate-700" : "bg-gray-100 py-2"
                } w-full rounded px-2 py-1 outline-none`}
                type="text"
                placeholder="Current Password"
                onChange={(e) => setCurrentPasswordForPass(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="">Enter New Password</label>
              <input
                className={`${
                  theme === "dark" ? "dark:bg-slate-700" : "bg-gray-100 py-2"
                } w-full rounded px-2 py-1 outline-none`}
                type="text"
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="">Confirm Password</label>
              <input
                className={`${
                  theme === "dark" ? "dark:bg-slate-700" : "bg-gray-100 py-2"
                } w-full rounded px-2 py-1 outline-none`}
                type="text"
                placeholder="Re-Enter Password"
                onChange={(e) => setReEnterNewPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div></div>
              <div className="space-x-4">
                <button
                  onClick={handlePasswordChange}
                  className={`${
                    theme === "dark"
                      ? "dark:bg-green-800"
                      : "bg-green-200 text-green-900"
                  }  px-4 py-0.5 rounded`}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
