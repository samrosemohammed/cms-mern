import path from "path";
import ModuleResource from "../models/ModuleResource.js";
import { fileURLToPath } from "url";
import fs from "fs";
// Get the directory name for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new module resource
export const createModuleResource = async (req, res) => {
  try {
    const { title, description, links, assignGroup, moduleId, teacherId } =
      req.body;

    // console.log("Received data:", req.body);
    const files = req.files.map((file) => file.path);
    const newResource = new ModuleResource({
      title,
      description,
      files,
      links: links || [],
      assignGroup,
      moduleId,
      teacherId,
      createdAt: new Date(),
    });

    await newResource.save();

    res.status(201).json({
      success: true,
      newResource,
      message: "Resource created successfully",
    });
  } catch (error) {
    console.log("Error creating module resource:", error.message);
    res
      .status(500)
      .json({ succes: false, message: "Server Error", error: error.message });
  }
};

export const getModuleResources = async (req, res) => {
  try {
    const { id, group } = req.params;
    // const { group } = req.params;
    console.log("Received data:", id);
    console.log("Received group : ", group);
    let resources;
    if (id !== "edit") {
      resources = await ModuleResource.find({
        $and: [
          {
            $or: [{ _id: id }, { moduleId: id }],
          },
          { assignGroup: group },
        ],
      })
        .populate("teacherId")
        .populate("moduleId");
    } else {
      // Fetch resources only by id
      resources = await ModuleResource.find({
        $or: [{ _id: group }, { moduleId: group }],
      })
        .populate("teacherId")
        .populate("moduleId");
    }
    // console.log(resources);
    res.status(200).json({
      success: true,
      resources,
      message: "Resources fetched successfully",
    });
  } catch (err) {
    console.log("Error fetching module resources:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const downloadResourceFile = (req, res) => {
  try {
    const { filename } = req.params;
    // console.log("Received file name to download:", filename);
    const filePath = path.join(__dirname, `../uploads/${filename}`);
    res.download(filePath, (err) => {
      if (err) {
        console.log("Error downloading file:", err.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
          error: err.message,
        });
      }
    });
  } catch (err) {
    console.log("Error downloading file:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const editModuleResource = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID of resource to edit:", id);
    const { title, description, links, filesToRemove = [] } = req.body;

    console.log("HELLLLLLO");
    console.log("Received data for edit:", req.body);

    // Fetch the existing resource
    const existingResource = await ModuleResource.findById(id);
    if (!existingResource) {
      return res.status(400).json({ message: "Resource not found" });
    }

    const file = req.files.map((file) => file.path);
    console.log("File recieved", file);
    // Filter out files that have been removed on the frontend
    const remainingFiles = existingResource.files.filter(
      (file) => !filesToRemove.includes(file)
    );

    console.log("remainingFiles:", remainingFiles);

    // Add new uploaded files without overriding existing ones
    const newFiles = req.files.map((file) => file.path);
    const allFiles = [...remainingFiles, ...newFiles];

    // Update the resource with the new data
    const updatedResource = await ModuleResource.findByIdAndUpdate(
      id,
      {
        title,
        description,
        files: allFiles,
        links: links || [],
        createdAt: new Date(),
      },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(400).json({ message: "Resource not found" });
    }

    res.status(200).json({
      success: true,
      updatedResource,
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

export const deleteModuleResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await ModuleResource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Delete the image file if it exists
    const files = resource.files;
    files.forEach((file) => {
      fs.unlink(file, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully.");
        }
      });
    });

    res
      .status(200)
      .json({ resource, message: "Resource deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller function to delete a file from the resource
export const deleteFile = async (req, res) => {
  try {
    const { id, fileName } = req.params;

    console.log("Received data for file deletion:", req.params);
    // Find the resource by id
    const resource = await ModuleResource.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    // Check if the file exists in the resource's files array
    const fileIndex = resource.files.findIndex((file) =>
      file.includes(fileName)
    );
    if (fileIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "File not found in resource" });
    }

    // Remove the file from the resource's files array
    const [removedFile] = resource.files.splice(fileIndex, 1);

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

    // Save the updated resource
    await resource.save();

    res
      .status(200)
      .json({ success: true, message: "File deleted successfully", resource });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
