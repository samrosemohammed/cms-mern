import Teacher from "../models/Teacher.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import SubmitWork from "../models/SubmitAssignment.js";
import { fileURLToPath } from "url";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTeacher = async (req, res) => {
  try {
    const {
      teacherName,
      teacherID,
      teacherEmail,
      teacherPassword,
      teacherCourse,
      teacherMobileNo,
    } = req.body;

    if (
      !teacherName ||
      !teacherID ||
      !teacherEmail ||
      !teacherPassword ||
      !teacherCourse ||
      !teacherMobileNo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const teacherExists = await Teacher.findOne({ teacherID });
    const teacherEmailExists = await Teacher.findOne({ teacherEmail });

    // Utility function to format the name
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedTeacherName = formatName(teacherName);

    if (teacherExists) {
      return res.status(400).json({ message: "Teacher ID already exists" });
    }

    if (teacherEmailExists) {
      return res.status(400).json({ message: "Teacher email already exists" });
    }

    if (!emailRegex.test(teacherEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    console.log("Received data:", req.body);
    console.log("Recieved file", req.file);
    const uploadStoreImage = req.file ? req.file.filename : null;
    console.log(uploadStoreImage);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(teacherPassword, salt);

    const newTeacher = new Teacher({
      teacherName: formattedTeacherName,
      teacherID,
      teacherEmail,
      teacherPassword: hashPassword,
      teacherCourse,
      teacherMobileNo,
      teacherImage: uploadStoreImage ? uploadStoreImage : null,
      createdBy: req.user._id,
    });

    const teacher = await newTeacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ createdBy: req.user._id });

    // console.log(teachers); // Log the retrieved teacher data
    res.status(200).json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const editTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const {
      teacherName,
      teacherID,
      teacherEmail,
      teacherPassword,
      teacherCourse,
      teacherMobileNo,
    } = req.body;
    const editUploadImage = req.file ? req.file.filename : null;
    console.log(editUploadImage);
    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(teacherPassword, salt);

    // Utility function to format the name
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedTeacherName = formatName(teacherName);

    if (!teacherName || !teacherID || !teacherEmail || !teacherPassword) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if the moduleID already exists for a different module
    const existingTeacherID = await Teacher.findOne({ teacherID });

    if (existingTeacherID && existingTeacherID._id.toString() !== id) {
      return res.status(400).json({ message: "Teacher ID already exists" });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    let newHashedPassword = teacher.teacherPassword;
    console.log("received pass : ", teacher.teacherPassword);
    if (teacherPassword !== teacher.teacherPassword) {
      const salt = await bcrypt.genSalt(10);
      newHashedPassword = await bcrypt.hash(teacherPassword, salt);
    }
    console.log("hash password if change : ", newHashedPassword);

    const oldImagePath = teacher.teacherImage
      ? path.join("uploads", teacher.teacherImage)
      : null;

    const updateTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        teacherName: formattedTeacherName,
        teacherID,
        teacherEmail,
        teacherPassword: newHashedPassword
          ? newHashedPassword
          : teacher.teacherPassword,
        teacherCourse,
        teacherMobileNo,
        teacherImage: editUploadImage ? editUploadImage : teacher.teacherImage,
      },
      { new: true }
    );

    if (!updateTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (editUploadImage && oldImagePath) {
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        } else {
          console.log("Old image deleted successfully.");
        }
      });
    }
    res.status(200).json(updateTeacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    // Delete the image file if it exists
    const imagePath = teacher.teacherImage
      ? path.join("uploads", teacher.teacherImage)
      : null;
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully.");
        }
      });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSubmitWork = async (req, res) => {
  const { id, group } = req.params;
  console.log(id, group);
  try {
    const submitWork = await SubmitWork.find({
      moduleId: id,
      assignGroup: group,
    })
      .populate("studentId")
      .populate("assignmentId");
    res.status(200).json({ message: "Submit work fetch success", submitWork });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateChangeEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, currentPasswordForEmail } = req.body;
    console.log("Received data:", req.body);
    if (!email || !currentPasswordForEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const isMatch = await bcrypt.compare(
      currentPasswordForEmail,
      teacher.teacherPassword
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const teacherEmailExists = await Teacher.findOne({ teacherEmail: email });
    if (teacherEmailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { teacherEmail: email },
      { new: true }
    );
    res.status(200).json(updatedTeacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePasswordChange = async (req, res) => {
  const { id } = req.params;
  const { currentPasswordForPass, newPassword, reEnterNewPassword } = req.body;

  try {
    // if all the fields are empty string then return error msg
    if (!currentPasswordForPass || !newPassword || !reEnterNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const isMatch = await bcrypt.compare(
      currentPasswordForPass,
      teacher.teacherPassword
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (newPassword !== reEnterNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { teacherPassword: newHashedPassword },
      { new: true }
    );
    res
      .status(200)
      .json({ updatedTeacher, message: "Password updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

export const updateTeacherProfile = async (req, res) => {
  const { id } = req.params;
  const { fullName, mobileNumber } = req.body;

  console.log("Received data:", req.body); // Should show the received form data
  console.log("Received file:", req.file); // Should show the uploaded file info

  try {
    if (!fullName && !mobileNumber && !req.file) {
      return res.status(400).json({ message: "No change detected" });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update teacher name and mobile number if provided
    teacher.teacherName = fullName || teacher.teacherName;
    teacher.teacherMobileNo = mobileNumber || teacher.teacherMobileNo;

    // If a new file is uploaded, delete the previous file and update with the new one
    if (req.file) {
      // Check if there is an existing image to delete
      if (teacher.teacherImage) {
        const previousImagePath = path.join(
          __dirname,
          "../uploads",
          teacher.teacherImage
        );

        // Check if the previous file exists and delete it
        if (fs.existsSync(previousImagePath)) {
          fs.unlink(previousImagePath, (err) => {
            if (err) {
              console.error("Error deleting previous image:", err);
            } else {
              console.log("Previous image deleted successfully.");
            }
          });
        }
      }

      // Update the teacher's image with the new file
      teacher.teacherImage = req.file.filename;
    }

    const updatedTeacher = await teacher.save();

    res
      .status(200)
      .json({ updatedTeacher, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error from update profile ", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const removeImage = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (!teacher.teacherImage) {
      return res.status(400).json({ message: "No image to delete" });
    }

    const imagePath = path.join(__dirname, "../uploads", teacher.teacherImage);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully.");
        }
      });
    }

    teacher.teacherImage = null;
    const updatedTeacher = await teacher.save();
    res.status(200).json({ updatedTeacher, message: "Image removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
