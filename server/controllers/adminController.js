import User from "../models/User.js";

export const updatePasswordChange = async (req, res) => {
  const { id } = req.params;
  const { currentPasswordForPass, newPassword, reEnterNewPassword } = req.body;
  if (!currentPasswordForPass || !newPassword || !reEnterNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log("Data from Admin Controller : ", req.body);
  try {
    const adminUser = await User.findById(id);
    if (!adminUser) {
      return res.status(400).json({ message: "Admin User not found" });
    }
    const isMatch = adminUser.password === currentPasswordForPass;
    if (!isMatch) {
      return res.status(400).json({ message: "Current Password is incorrect" });
    }
    if (newPassword !== reEnterNewPassword) {
      return res.status(400).json({
        message: "New Password do not match with Re-entered Password",
      });
    }

    adminUser.password = newPassword;
    await adminUser.save();
    res.status(200).json({ message: "Password updated", adminUser });
  } catch (err) {
    console.log("Error from adminController: ", err.message);
  }
};
