import ModuleAssign from "../models/ModuleAssign.js";
import ModuleResource from "../models/ModuleResource.js";
import ModuleAssignment from "../models/ModuleAssignment.js";
import ModuleAnnouncement from "../models/ModuleAnnouncement.js";
import mongoose from "mongoose";

export const getModuleAssign = async (req, res) => {
  try {
    const { group, adminID } = req.params;
    console.log("Received group : ", group, adminID);

    // Convert adminID to ObjectId
    const adminObjectId = new mongoose.Types.ObjectId(adminID);

    // Use aggregation to remove duplicates based on moduleCode and assignGroup
    const moduleAssign = await ModuleAssign.aggregate([
      {
        $match: {
          assignGroup: group, // Match group
          createdBy: adminObjectId, // Match createdBy (admin or teacher)
        },
      },
      {
        $group: {
          _id: { moduleCode: "$moduleCode", assignGroup: "$assignGroup" },
          moduleId: { $first: "$moduleCode" },
          moduleName: { $first: "$moduleName" },
          teacherId: { $first: "$teacherId" }, // First teacher for this group/module
          teacherName: { $first: "$teacherName" },
        },
      },
      {
        $lookup: {
          from: "modules", // Name of the modules collection
          localField: "moduleId",
          foreignField: "_id",
          as: "moduleDetails",
        },
      },
      {
        $unwind: "$moduleDetails", // Unwind module details array
      },
      {
        $sort: { "moduleDetails.moduleName": 1 }, // Sort by moduleName alphabetically (or any other field)
      },
    ]);

    console.log("Module Assign from User Student Controller:", moduleAssign);
    res.status(200).json(moduleAssign);
  } catch (err) {
    console.log("Err message from User Student Controller:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getModuleResources = async (req, res) => {
  const { id } = req.params;
  console.log("Received Module Id :", id);
  try {
    const moduleResources = await ModuleResource.find({
      moduleId: id,
    });
    res.status(200).json(moduleResources);
  } catch (err) {
    console.log("Error fetching module resources:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getModuleAssignment = async (req, res) => {
  const { id } = req.params;
  console.log("Received Module for assignment Id :", id);
  try {
    const moduleAssignment = await ModuleAssignment.find({
      moduleId: id,
    });
    res.status(200).json(moduleAssignment);
  } catch (err) {
    console.log("Error fetching module assignment:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getModuleAnnouncements = async (req, res) => {
  const { id } = req.params;
  console.log("Received Module Id  for announcement:", id);
  try {
    const moduleAnnouncements = await ModuleAnnouncement.find({
      moduleId: id,
    }).populate("teacherId");

    console.log(
      "Module Announcement from User Student Controller:",
      moduleAnnouncements
    );
    res.status(200).json(moduleAnnouncements);
  } catch (err) {
    console.log("Error fetching module announcements:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
