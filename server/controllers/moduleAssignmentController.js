import ModuleAssignment from "../models/ModuleAssignment.js";
import fs from "fs";

export const createModuleAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      links,
      dueDate,
      dueDateTime,
      assignGroup,
      moduleId,
      teacherId,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!dueDate) {
      return res.status(400).json({ message: "Due Date is Required" });
    }

    if (!dueDateTime) {
      return res.status(400).json({ message: "Due Date Time is required" });
    }

    console.log("assign data:", req.body);
    const files = req.files.map((file) => file.path);

    // if (!title || !moduleId || !teacherId) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    const newModuleAssignment = new ModuleAssignment({
      title,
      description,
      files,
      links: links || [],
      DueDate: dueDate,
      DueDateTime: dueDateTime,
      assignGroup,
      moduleId,
      teacherId,
      createdAt: new Date(),
    });

    const savedModuleAssignment = await newModuleAssignment.save();

    res.status(201).json({
      success: true,
      savedModuleAssignment,
      message: "Assignment created",
    });
  } catch (error) {
    console.log("Error creating module assignment:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getModuleAssignments = async (req, res) => {
  try {
    const { id, group } = req.params;
    console.log("ID", id);
    // console.log("Received data:", id);
    let assignments;
    if (id !== "edit") {
      assignments = await ModuleAssignment.find({
        $and: [
          {
            $or: [{ _id: id }, { moduleId: id }],
          },
          { assignGroup: group },
        ],
      });
    } else {
      // Fetch resources only by id
      assignments = await ModuleAssignment.find({
        $or: [{ _id: group }, { moduleId: group }],
      });
    }

    console.log("Assignments:", assignments);

    // console.log(assignments);
    res.status(200).json({
      success: true,
      assignments,
      message: "Assignments fetched successfully",
    });
  } catch (err) {
    console.log("Error fetching module assignments:", err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const editModuleAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      dueDateTime,
      links,
      filesToRemove = [],
    } = req.body;

    //   console.log("HELLLLLLO");
    console.log("Received data for edit:", req.body);

    // Fetch the existing resource
    const existingAssignment = await ModuleAssignment.findById(id);
    if (!existingAssignment) {
      return res.status(400).json({ message: "Resource not found" });
    }

    const file = req.files.map((file) => file.path);
    console.log("File recieved", file);
    // Filter out files that have been removed on the frontend
    const remainingFiles = existingAssignment.files.filter(
      (file) => !filesToRemove.includes(file)
    );

    console.log("remainingFiles:", remainingFiles);

    // Add new uploaded files without overriding existing ones
    const newFiles = req.files.map((file) => file.path);
    const allFiles = [...remainingFiles, ...newFiles];

    // Update the resource with the new data
    const updatedAssignment = await ModuleAssignment.findByIdAndUpdate(
      id,
      {
        title,
        description,
        DueDate: dueDate,
        DueDateTime: dueDateTime,
        files: allFiles,
        links: links || [],
        createdAt: new Date(),
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(400).json({ message: "Resource not found" });
    }

    res.status(200).json({
      success: true,
      updatedAssignment,
      message: "Assignment updated",
    });
  } catch (error) {
    console.log("Error updating module resource:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  console.log("ID", id);
  const assignment = await ModuleAssignment.findByIdAndDelete(id);
  if (!assignment) {
    return res.status(400).json({ message: "Assignment not found" });
  }

  const files = assignment.files;
  files.forEach((file) => {
    fs.unlink(file, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully.");
      }
    });
  });

  res.status(200).json({
    success: true,
    message: "Assignment deleted",
  });
};

export const deleteFile = async (req, res) => {
  try {
    const { id, fileName } = req.params;

    console.log("Received data for file deletion:", req.params);
    // Find the resource by id
    const assignment = await ModuleAssignment.findById(id);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "assignment not found" });
    }

    // Check if the file exists in the assignment's files array
    const fileIndex = assignment.files.findIndex((file) =>
      file.includes(fileName)
    );
    if (fileIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "File not found in assignment" });
    }

    // Remove the file from the assignment's files array
    const [removedFile] = assignment.files.splice(fileIndex, 1);

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
    await assignment.save();

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      assignment,
    });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
