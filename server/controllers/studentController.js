import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
