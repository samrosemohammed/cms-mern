import Module from "../models/Module.js";

export const createModule = async (req, res) => {
  try {
    const { moduleName, moduleID, moduleDate, moduleEndDate } = req.body;

    console.log("Received data:", req.body);

    if (!moduleName || !moduleID || !moduleDate || !moduleEndDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (moduleDate > moduleEndDate) {
      return res
        .status(400)
        .json({ message: "Module start date cannot be after end date" });
    }

    // Utility function to format the name
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedModuleName = formatName(moduleName);

    // if (moduleDate < new Date().toISOString()) {
    //   return res
    //     .status(400)
    //     .json({ message: "Module start date cannot be in the past" });
    // }

    const existingModuleID = await Module.findOne({ moduleID });
    if (existingModuleID) {
      return res.status(400).json({ message: "Module ID already exists" });
    }

    const newModule = new Module({
      moduleName: formattedModuleName,
      moduleID,
      moduleDate,
      moduleEndDate,
      createdBy: req.user._id,
    });

    const module = await newModule.save();
    res.status(201).json({ module, message: "Module created successfully" });
    // res.status(201).json({ message: "Module created successfully" });
    // res.json({ message: "Module created successfully" });
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(500).send("Server Error");
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find({ createdBy: req.user._id });
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const editModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { moduleName, moduleID, moduleDate, moduleEndDate } = req.body;
    const existingModule = await Module.findOne({ moduleID });
    console.log(id);
    console.log("Received data:", req.body);

    if (!moduleName || !moduleID || !moduleDate || !moduleEndDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (existingModule && existingModule._id.toString() !== id) {
      return res.status(400).json({ message: "Module ID already exists" });
    }

    // Utility function to format the name
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedModuleName = formatName(moduleName);

    const updateModule = await Module.findByIdAndUpdate(
      id,
      {
        moduleName: formattedModuleName,
        moduleID,
        moduleDate,
        moduleEndDate,
      },
      { new: true }
    );

    if (!updateModule) {
      return res.status(404).json({ message: "Module not found" });
    }
    res
      .status(200)
      .json({ updateModule, message: "Module updated successfully" });
  } catch (err) {
    console.error("Error updating module:", err);
    res.status(500).send("Server Error");
  }
};

// Delete Module
export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedModule = await Module.findOneAndDelete({ _id: id });

    if (!deletedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("Error deleting module:", err);
    res.status(500).send("Server Error");
  }
};
