import SubmitAssignment from "../models/SubmitAssignment.js";
import ModuleAssignment from "../models/ModuleAssignment.js";
import moment from "moment";
import fs from "fs";

export const createSubmitAssignment = async (req, res) => {
  const { assignmentObjectId, studentId, moduleId, assignGroup, links } =
    req.body;
  console.log("Received data for Submit Assignment:", req.body);
  const files = req.files.map((file) => file.path);
  console.log("Files:", files);

  try {
    const assignment = await ModuleAssignment.findById(assignmentObjectId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    const currentDateTime = moment();
    const dueDateTime = moment(
      `${assignment.DueDate} ${assignment.DueDateTime}`,
      "YYYY-MM-DD hh:mm A"
    );

    let status = "On Time";
    if (currentDateTime.isAfter(dueDateTime)) {
      status = "Late Submit";
    }

    // Check if no files were attached and links are empty
    if (files.length === 0 && (!links || links.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "You haven't attached any files or provided any links",
      });
    }

    const newSubmitAssignment = new SubmitAssignment({
      assignmentId: assignmentObjectId,
      studentId,
      moduleId,
      assignGroup,
      files,
      links,
      submissionDate: new Date(),
      status, // Add status field here
    });
    await newSubmitAssignment.save();
    res.status(201).json({
      success: true,
      newSubmitAssignment,
      message: "Submit Assignment created successfully",
    });
  } catch (error) {
    console.log("Error creating submit assignment:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const editSubmittedAssignments = async (req, res) => {
  const { id } = req.params;
  const { links, filesToRemove = [] } = req.body;
  console.log("Received data for editing Submit Assignment:", req.body);
  const files = req.files.map((file) => file.path);

  const assignment = await ModuleAssignment.findById(id);
  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: "Assignment not found.",
    });
  }

  const currentDateTime = moment();
  const dueDateTime = moment(
    `${assignment.DueDate} ${assignment.DueDateTime}`,
    "YYYY-MM-DD hh:mm A"
  );

  let status = "On Time";
  if (currentDateTime.isAfter(dueDateTime)) {
    status = "Late Submit";
  }

  const exitSubmitAssignment = await SubmitAssignment.findOne({
    assignmentId: id,
  });
  if (!exitSubmitAssignment) {
    return res.status(404).json({
      success: false,
      message: "Submitted Assignment not found",
    });
  }
  const remainingFiles = exitSubmitAssignment.files.filter(
    (file) => !filesToRemove.includes(file)
  );
  // Add new uploaded files without overriding existing ones
  const newFiles = req.files.map((file) => file.path);
  const allFiles = [...remainingFiles, ...newFiles];

  const updatedSubmitAssignment = await SubmitAssignment.findOneAndUpdate(
    {
      assignmentId: id,
    },
    {
      files: allFiles,
      links: links || [],
      submissionDate: new Date(),
      status,
    },
    { new: true }
  );

  if (!updatedSubmitAssignment) {
    return res.status(400).json({
      message: "Submitted Assignment not found",
    });
  }

  res.status(200).json({
    success: true,
    updatedSubmitAssignment,
    message: "Submitted Assignment updated successfully",
  });
};

export const getSubmitAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID of Assignment:", id);
    const submitAssignments = await SubmitAssignment.find({
      $or: [{ assignmentId: id }, { moduleId: id }],
    });
    res
      .status(200)
      .json({ message: "Submit Assignment Data", submitAssignments });
  } catch (err) {
    console.log("Error fetching submit assignments:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const deleteSubmitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID of Assignment:", id);
    const assignment = await ModuleAssignment.findById(id);
    const deletedSubmitAssignment = await SubmitAssignment.findOneAndDelete({
      assignmentId: id,
    });
    // also delete the file store in the upload
    if (deletedSubmitAssignment.files.length > 0) {
      deletedSubmitAssignment.files.map((file) => {
        fs.unlink(file, (err) => {
          if (err) {
            console.error("Error deleting file from storage:", err);
            return res.status(500).json({
              success: false,
              message: "Error deleting file from storage",
            });
          }
          console.log("File deleted successfully from storage.");
        });
      });
    }

    if (!deletedSubmitAssignment) {
      return res
        .status(404)
        .json({ success: false, message: "Submit Assignment not found" });
    }
    res.status(200).json({
      success: true,
      message: `Unsubmiited assignment on ${assignment.title}`,
    });
  } catch (err) {
    console.log("Error deleting submit assignment:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id, fileName } = req.params;

    console.log("Received data for file deletion:", req.params);
    // Find the resource by id
    const submittedAssignment = await SubmitAssignment.findOne({
      assignmentId: id,
    });
    console.log("Submitted Assignment:", submittedAssignment);
    if (!submittedAssignment) {
      return res
        .status(404)
        .json({ success: false, message: "submittedAssignment not found" });
    }

    // Check if the file exists in the announcement's files array
    const fileIndex = submittedAssignment.files.findIndex((file) =>
      file.includes(fileName)
    );
    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "File not found in submittedAssignment",
      });
    }

    // Remove the file from the announcement's files array
    const [removedFile] = submittedAssignment.files.splice(fileIndex, 1);

    // Delete the file from the upload storage
    fs.unlink(removedFile, (err) => {
      if (err) {
        console.error("Error deleting file from storage:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting file from storage",
        });
      }
      console.log("File deleted successfully from storage.");
    });

    // Save the updated assignment
    await submittedAssignment.save();

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      submittedAssignment,
    });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
