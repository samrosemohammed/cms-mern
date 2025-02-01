import ModuleAssign from "../models/ModuleAssign.js";

export const createModuleAssign = async (req, res) => {
  try {
    const {
      teacherName,
      assignGroup,
      moduleID,
      moduleName,
      moduleCode,
      teacherId,
    } = req.body;

    console.log("Received data:", req.body);
    const existingAssignment = await ModuleAssign.findOne({
      teacherName,
      assignGroup,
      moduleName,
      createdBy: req.user._id,
    });

    if (existingAssignment) {
      console.log("Already Exist");
      return res.status(400).json({
        message:
          "This teacher is already assigned to this group for this module.",
      });
    }

    const newModuleAssign = new ModuleAssign({
      teacherName,
      assignGroup,
      moduleID,
      moduleName,
      moduleCode,
      teacherId,
      dateAssigned: new Date(),
      createdBy: req.user._id,
    });

    await newModuleAssign.save();
    res
      .status(201)
      .json({ newModuleAssign, message: "Module assigned successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getModuleAssign = async (req, res) => {
  console.log("User from Assign Module Controller : ", req.user);
  try {
    const moduleAssign = await ModuleAssign.find({
      $or: [
        { teacherId: req.user._id }, // Fetch modules assigned to the teacher
        { createdBy: req.user._id }, // Fetch modules created by the admin
      ],
    })
      .populate("moduleCode")
      .populate("teacherId");
    res.status(200).json(moduleAssign);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const editModuleAssign = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherName, assignGroup, teacherId } = req.body;
    console.log("Received data:", req.body);

    if (!teacherName || !assignGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updateAssignModule = await ModuleAssign.findByIdAndUpdate(
      id,
      {
        teacherName,
        assignGroup,
        teacherId,
      },
      { new: true }
    );

    if (!updateAssignModule) {
      return res.status(404).json({ message: "Module Assign not found" });
    }

    res.status(200).json({
      updateAssignModule,
      message: "Module Assign updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteModuleAssign = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.json({ message: "Unauthenticated" });
  }

  await ModuleAssign.findByIdAndDelete(id);

  res.json({ message: "Module Assign deleted successfully." });
};
