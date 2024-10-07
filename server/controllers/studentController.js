import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { io } from "../server.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createStudent = async (req, res) => {
  try {
    const {
      studentName,
      studentID,
      studentEmail,
      studentPassword,
      studentCourseSelected,
      studentGroup,
      studentMobileNo,
      studentStartYear,
      studentEndYear,
    } = req.body;

    if (
      !studentName ||
      !studentID ||
      !studentEmail ||
      !studentPassword ||
      !studentCourseSelected ||
      !studentGroup ||
      !studentMobileNo ||
      !studentStartYear ||
      !studentEndYear
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Utility function to format the name
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedStudentName = formatName(studentName);

    // check whether the student already exists
    const studentExists = await Student.findOne({ studentID });
    const studentEmailExists = await Student.findOne({ studentEmail });

    if (studentExists) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    if (studentEmailExists) {
      return res.status(400).json({ message: "Student Email already exists" });
    }

    if (!emailRegex.test(studentEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    console.log("Received data:", req.body);
    console.log("Received file:", req.body.studentImage);
    const uploadStoreImage = req.file ? req.file.filename : null;
    console.log(uploadStoreImage);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(studentPassword, salt);

    const newStudent = new Student({
      studentName: formattedStudentName,
      studentID,
      studentEmail,
      studentPassword: hashPassword,
      studentCourseSelected,
      studentGroup: studentGroup.toUpperCase(),
      studentMobileNo,
      studentStartYear,
      studentEndYear,
      studentImage: uploadStoreImage ? uploadStoreImage : null,
      createdBy: req.user._id,
    });

    const student = await newStudent.save();
    res.status(201).json({ student, message: "Student created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error while creating student");
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.user._id });
    // console.log(students); // Log the retrieved student data
    res.status(200).json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studentName,
      studentID,
      studentEmail,
      studentPassword,
      studentCourseSelected,
      studentGroup,
      studentMobileNo,
      studentStartYear,
      studentEndYear,
    } = req.body;

    console.log(req.file);
    const editUploadImage = req.file ? req.file.filename : null;
    console.log(editUploadImage);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(studentPassword, salt);

    if (
      !studentName ||
      !studentID ||
      !studentEmail ||
      !studentPassword ||
      !studentCourseSelected ||
      !studentGroup ||
      !studentMobileNo ||
      !studentStartYear ||
      !studentEndYear
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the moduleID already exists for a different module
    const existingStudentID = await Student.findOne({ studentID });
    // Utility function to format the name
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedStudentName = formatName(studentName);

    if (existingStudentID && existingStudentID._id.toString() !== id) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    if (!emailRegex.test(studentEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find the student to get the old image path
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const oldImagePath = student.studentImage
      ? path.join("uploads", student.studentImage)
      : null;

    const updateStudent = await Student.findByIdAndUpdate(
      id,
      {
        studentName: formattedStudentName,
        studentID,
        studentEmail,
        studentPassword: hashPassword,
        studentCourseSelected,
        studentGroup: studentGroup.toUpperCase(),
        studentMobileNo,
        studentStartYear,
        studentEndYear,
        studentImage: editUploadImage ? editUploadImage : student.studentImage,
      },
      { new: true }
    );

    if (!updateStudent) {
      return res.status(400).json({ message: "Student not found" });
    }

    // If a new image is uploaded, delete the old image
    if (editUploadImage && oldImagePath) {
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        } else {
          console.log("Old image deleted successfully.");
        }
      });
    }

    res
      .status(200)
      .json({ updateStudent, message: "Student updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete the image file if it exists
    const imagePath = student.studentImage
      ? path.join("uploads", student.studentImage)
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

export const removeImage = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    if (!student.studentImage) {
      return res.status(400).json({ message: "No image to delete" });
    }

    const imagePath = path.join(__dirname, "../uploads", student.studentImage);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully.");
        }
      });
    }

    student.studentImage = null;
    const updatedStudent = await student.save();
    io.emit("userUpdated", updatedStudent);
    res
      .status(200)
      .json({ updatedStudent, message: "Image removed permanently" });
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
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const isMatch = await bcrypt.compare(
      currentPasswordForEmail,
      student.studentPassword
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const studentEmailExists = await Student.findOne({ studentEmail: email });
    if (studentEmailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { studentEmail: email },
      { new: true }
    );
    res
      .status(200)
      .json({ updatedStudent, message: "Email updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePasswordChange = async (req, res) => {
  const { id } = req.params;
  const { currentPasswordForPassword, newPassword, confirmPassword } = req.body;

  try {
    // if all the fields are empty string then return error msg
    if (!currentPasswordForPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const isMatch = await bcrypt.compare(
      currentPasswordForPassword,
      student.studentPassword
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { studentPassword: newHashedPassword },
      { new: true }
    );
    res
      .status(200)
      .json({ updatedStudent, message: "Password updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

export const updateStudentProfile = async (req, res) => {
  const { id } = req.params;
  const { fullName, mobileNumber } = req.body;

  console.log("Received data:", req.body); // Should show the received form data
  console.log("Received file:", req.file); // Should show the uploaded file info

  try {
    if (!fullName && !mobileNumber && !req.file) {
      return res.status(400).json({ message: "No change detected" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update teacher name and mobile number if provided
    student.studentName = fullName || student.studentName;
    student.studentMobileNo = mobileNumber || student.studentMobileNo;

    // If a new file is uploaded, delete the previous file and update with the new one
    if (req.file) {
      // Check if there is an existing image to delete
      if (student.studentImage) {
        const previousImagePath = path.join(
          __dirname,
          "../uploads",
          student.studentImage
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
      student.studentImage = req.file.filename;
    }

    const updatedStudent = await student.save();

    io.emit("userUpdated", updatedStudent);
    res
      .status(200)
      .json({ updatedStudent, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error from update profile ", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
