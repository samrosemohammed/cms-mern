import ModuleAnnouncement from "../models/ModuleAnnouncement.js";
import fs from "fs";

export const createModuleAnnouncement = async (req, res) => {
  try {
    const { description, links, assignGroup, moduleId, teacherId } = req.body;
    console.log("Received data:", req.body);
    const files = req.files.map((file) => file.path);
    if (!description || !moduleId || !teacherId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newModuleAnnouncement = new ModuleAnnouncement({
      description,
      files,
      links: links || [],
      assignGroup,
      moduleId,
      teacherId,
      createdAt: new Date(),
    });
    const savedModuleAnnouncement = await newModuleAnnouncement.save();
    res.status(201).json({
      success: true,
      savedModuleAnnouncement,
      message: "Module Announcement created successfully",
    });
  } catch (err) {
    console.log("Error in createModuleAnnouncement: ", err);
    res.status(500).json({ message: err.message });
  }
};

export const getModuleAnnouncements = async (req, res) => {
  try {
    const { id, group } = req.params;
    console.log("ID", id);
    console.log("Received data group:", group);
    let announcements;
    if (group) {
      announcements = await ModuleAnnouncement.find({
        $and: [
          {
            $or: [{ _id: id }, { moduleId: id }],
          },
          { assignGroup: group },
        ],
      }).populate("teacherId");
    } else {
      // Fetch announcements only by id
      announcements = await ModuleAnnouncement.find({
        $or: [{ _id: id }, { moduleId: id }],
      }).populate("teacherId");
    }
    res.status(200).json({ success: true, announcements });
  } catch (err) {
    console.log("Error in getModuleAnnouncements: ", err);
    res.status(500).json({ message: err.message });
  }
};

export const editModuleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, links, filesToRemove = [] } = req.body;

    console.log("Received data for edit:", req.body);

    // Fetch the existing resource
    const existingAnnouncement = await ModuleAnnouncement.findById(id);
    if (!existingAnnouncement) {
      return res.status(400).json({ message: "Resource not found" });
    }

    const file = req.files.map((file) => file.path);
    console.log("File recieved", file);
    // Filter out files that have been removed on the frontend
    const remainingFiles = existingAnnouncement.files.filter(
      (file) => !filesToRemove.includes(file)
    );

    console.log("remainingFiles:", remainingFiles);

    // Add new uploaded files without overriding existing ones
    const newFiles = req.files.map((file) => file.path);
    const allFiles = [...remainingFiles, ...newFiles];

    // Update the resource with the new data
    const updatedAnnouncement = await ModuleAnnouncement.findByIdAndUpdate(
      id,
      {
        description,
        files: allFiles,
        links: links || [],
        createdAt: new Date(),
      },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(400).json({ message: "Resource not found" });
    }

    res.status(200).json({
      success: true,
      updatedAnnouncement,
      message: "Resource updated successfully",
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

export const deleteModuleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const announcement = await ModuleAnnouncement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    const files = announcement.files;
    files.forEach((file) => {
      fs.unlink(file, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully.");
        }
      });
    });

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    res.status(500).send("Server Error");
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id, fileName } = req.params;

    console.log("Received data for file deletion:", req.params);
    // Find the resource by id
    const announcement = await ModuleAnnouncement.findById(id);
    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "announcement not found" });
    }

    // Check if the file exists in the announcement's files array
    const fileIndex = announcement.files.findIndex((file) =>
      file.includes(fileName)
    );
    if (fileIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "File not found in assignment" });
    }

    // Remove the file from the announcement's files array
    const [removedFile] = announcement.files.splice(fileIndex, 1);

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
    await announcement.save();

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      announcement,
    });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
