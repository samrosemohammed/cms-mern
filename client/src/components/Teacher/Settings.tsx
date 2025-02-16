import { Eye, EyeOff, Pencil, X } from "lucide-react";
import defaultImage from "../../assets/default-image.png";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FeedBack } from "../FeedBack";
import { useTheme } from "../../utlis/ThemeContext";

export const Settings = () => {
  const { theme } = useTheme();
  const [userDetails, setUserDetails] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [isChangeEmailFormVisible, setIsChangeEmailFormVisbile] =
    useState(false);
  const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] =
    useState<string>("");
  const [currentPasswordForPass, setCurrentPasswordForPass] =
    useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>("");
  const [isRemoveProfileVisible, setIsRemoveProfileVisible] =
    useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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

  const handleChangePassword = () => {
    console.log("Change Password Clicked");
    setIsChangePasswordFormVisible(true);
  };

  const handleChangeEmail = () => {
    console.log("Change Email Clicked");
    setIsChangeEmailFormVisbile(true);
  };

  const handleEditImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
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

  const handleCancelEmailChange = () => {
    setEmail("");
    setCurrentPasswordForEmail("");
    console.log("Email:", email);
    console.log("Current Password:", currentPasswordForEmail);
    setIsChangeEmailFormVisbile(false);
  };

  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    setServerMessage("");
    const data = { currentPasswordForPass, newPassword, reEnterNewPassword };
    console.log("Data: ", data);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/teacher-dashboard/settings/change-password/${userDetails._id}`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Response: ", response.data);

        // Reset the form states after successful response
        setCurrentPasswordForPass("");
        setNewPassword("");
        setReEnterNewPassword("");

        setIsChangePasswordFormVisible(false);
      }
    } catch (err: any) {
      console.error("Error:", err.response);
      setServerMessage(err.response.data.message);
    }
  };

  const handleSubmitEmailChange = async (e: any) => {
    e.preventDefault();
    setServerMessage("");
    const data = { email, currentPasswordForEmail };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/teacher-dashboard/settings/change-email/${userDetails._id}`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log("Response: ", response);
      if (response.status === 200) {
        console.log("Response: ", response);
        setEmail("");
        setCurrentPasswordForEmail("");
        await fetchUser();
        setIsChangeEmailFormVisbile(false);
      }
    } catch (err: any) {
      console.error("Error:", err.response);
      setServerMessage(err.response.data.message);
    }
    console.log("Data: ", data);
    console.log("ID: ", userDetails._id);
    console.log("Email:", email);
    console.log("Current Password:", currentPasswordForEmail);
  };

  const handleSaveChanges = async () => {
    setServerMessage("");
    const formData = new FormData();
    if (fullName && fullName !== userDetails?.teacherName) {
      formData.append("fullName", fullName);
      setServerMessage("User Name Exists");
    }
    if (mobileNumber && mobileNumber !== userDetails?.teacherMobileNo) {
      formData.append("mobileNumber", mobileNumber);
      setServerMessage("Mobile Number Exists");
    }
    if (selectedFile) {
      formData.append("teacherImage", selectedFile[0]);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/teacher-dashboard/settings/profile/${userDetails._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Response: ", response.data);
        setFullName("");
        setMobileNumber("");
        setServerMessage(response.data.message);
        await fetchUser();
      }
    } catch (err: any) {
      console.error("Error:", err.response);
      setServerMessage(err.response.data.message);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  const handleRemoveImage = () => {
    console.log("Remove Image clicked");
    setIsRemoveProfileVisible(true);
  };

  const handleCancelRemoveProfie = () => {
    setIsRemoveProfileVisible(false);
  };

  const handleBackendRemoveImage = async (e: any) => {
    e.preventDefault();
    setServerMessage("");
    console.log("Remove Image from backend");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/teacher-dashboard/settings/remove-img/${userDetails._id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Response: ", response.data);
        setServerMessage(response.data.message);
        setSelectedImage(null);
        setSelectedFile(null);
        fetchUser();
      }
    } catch (err: any) {
      console.error("Error:", err.response);
      setServerMessage(err.response.data.message);
      if ((err.response.data.message = "No Image to delete")) {
        setServerMessage("Image removed");
        setSelectedImage(null);
        setSelectedFile(null);
      }
    }
    setIsRemoveProfileVisible(false);
  };

  const imgUrl =
    userDetails?.teacherImage !== null
      ? `http://localhost:5000/uploads/${userDetails?.teacherImage}`
      : defaultImage;

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
                } w-full rounded px-4 py-3 mb-2 `}
                type="text"
                placeholder={userDetails && userDetails.teacherName}
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
                placeholder={userDetails && userDetails.teacherEmail}
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
            <div className="space-y-2">
              <label
                htmlFor="full-name"
                className={`${
                  theme === "dark" ? "dark:text-slate-300" : "text-gray-500"
                }`}
              >
                Phone No
              </label>
              <input
                className={`${
                  theme === "dark"
                    ? "dark:bg-slate-800 dark:text-slate-400"
                    : "bg-gray-200 text-gray-500"
                } w-full rounded px-4 py-3 mb-2 `}
                type="text"
                placeholder={userDetails && userDetails.teacherMobileNo}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
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
                  onClick={handleRemoveImage}
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
          onClick={handleSaveChanges}
          className={`${
            theme === "dark"
              ? "dark:bg-green-800 dark:text-slate-300"
              : "bg-green-200 text-green-900"
          } mt-6  px-2 py-0.5 rounded`}
        >
          Save Changes
        </button>
      </section>

      {isChangeEmailFormVisible && (
        <section
          className={`${
            theme === "dark"
              ? "bg-slate-900 dark:text-slate-300"
              : "bg-[#00000055] z-[999] text-gray-600"
          } fixed inset-0  bg-opacity-80 flex items-center justify-center rounded`}
        >
          <form
            action=""
            onSubmit={handleSubmitEmailChange}
            className={`${
              theme === "dark" ? "dark:bg-slate-800" : "bg-gray-100"
            } space-y-4 max-w-screen-sm for-change-email rounded p-8`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[18px]">Change Email Address</h3>
              <X
                className={`${
                  theme === "dark"
                    ? "dark:hover:bg-slate-700"
                    : "hover:bg-gray-100"
                } cursor-pointer rounded`}
                size={28}
                onClick={() => setIsChangeEmailFormVisbile(false)}
              />
            </div>
            <p
              className={`${
                theme === "dark" ? "dark:text-slate-400" : "text-gray-500"
              } text-[14px] `}
            >
              You are going to update your primary email address with the new
              one.
            </p>
            <div className="space-y-2">
              <label htmlFor="" className="">
                New Email Address
              </label>
              <input
                className={`${
                  theme === "dark"
                    ? "dark:bg-slate-700"
                    : "bg-gray-200 outline-none py-2"
                } w-full rounded px-2 py-1`}
                type="text"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="">Enter Current Password</label>
              <div className="relative">
                <input
                  className={`${
                    theme === "dark"
                      ? "dark:bg-slate-700"
                      : "bg-gray-200 outline-none py-2"
                  } w-full rounded px-2 py-1`}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Current Password"
                  onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                />
                {isPasswordVisible ? (
                  <EyeOff
                    className={`${
                      theme === "dark" ? "" : "text-gray-500 top-2"
                    } absolute right-2 top-1 cursor-pointer`}
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <Eye
                    className={`${
                      theme === "dark" ? "" : "text-gray-500 top-2"
                    } absolute right-2 top-1 cursor-pointer`}
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div></div>
              <div className="space-x-4">
                <button
                  onClick={handleCancelEmailChange}
                  className={`${
                    theme === "dark"
                      ? "dark:border-slate-600"
                      : "border-gray-300"
                  } border-2  px-4 py-0.5 rounded`}
                >
                  Cancel
                </button>
                <input
                  onClick={handleSubmitEmailChange}
                  type="submit"
                  className={`${
                    theme === "dark"
                      ? "dark:bg-green-800"
                      : "bg-green-300 text-green-900"
                  } border-2 border-transparent px-4 py-0.5 rounded`}
                />
              </div>
            </div>
          </form>
        </section>
      )}

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

      {isRemoveProfileVisible && (
        <section
          className={`${
            theme === "dark"
              ? "bg-slate-900 dark:text-slate-300"
              : "bg-[#00000055] text-gray-500"
          } z-[999] fixed inset-0 bg-opacity-80 flex items-center justify-center`}
        >
          <form
            className={`${
              theme === "dark" ? "dark:bg-slate-800" : "bg-white"
            } max-w-screen-sm p-4 rounded space-y-6`}
            action=""
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[18px]">Remove Profile Image ?</h3>
              <X
                className={`${
                  theme == "dark"
                    ? "dark:hover:bg-slate-700"
                    : "hover:bg-gray-100"
                } cursor-pointer rounded`}
                size={28}
                onClick={handleCancelRemoveProfie}
              />
            </div>
            <p>Are you sure you want to remove your profile picutre ?</p>
            <div className="flex item-center justify-between">
              <div></div>
              <div className="space-x-4">
                <button
                  onClick={handleCancelRemoveProfie}
                  className={`${
                    theme === "dark"
                      ? "dark:border-slate-600"
                      : "border-slate-300 hover:bg-gray-100"
                  } border-2 px-4 py-0.5 rounded`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBackendRemoveImage}
                  className={`${
                    theme === "dark"
                      ? "dark:bg-red-800"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }  border-2 border-transparent px-4 py-0.5 rounded`}
                >
                  Remove
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
