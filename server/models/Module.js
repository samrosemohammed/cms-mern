import mongoose from "mongoose";
import ModuleAssign from "./ModuleAssign.js";
const ModuleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  moduleID: { type: String, required: true, unique: true },
  moduleDate: { type: Date, required: true },
  moduleEndDate: { type: Date, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin_users",
    required: true,
  },
});

// Pre-save hook to update related ModuleAssign documents
ModuleSchema.pre("save", async function (next) {
  if (!this.isModified("moduleID") && !this.isModified("moduleName")) {
    return next();
  }

  try {
    // Update moduleCode and moduleName in ModuleAssign documents
    await ModuleAssign.updateMany(
      { moduleCode: this._id },
      {
        $set: {
          moduleID: this.moduleID,
          moduleName: this.moduleName,
        },
      }
    );
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-remove hook to delete related ModuleAssign documents
ModuleSchema.pre("findOneAndDelete", async function (next) {
  try {
    const module = await this.model.findOne(this.getFilter());
    await ModuleAssign.deleteMany({ moduleCode: module._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Module = mongoose.model("modules", ModuleSchema);
export default Module;
