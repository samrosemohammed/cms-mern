import Teacher from "../models/Teacher.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import SubmitWork from "../models/SubmitAssignment.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
