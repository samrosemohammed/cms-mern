import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is an admin
    let user = await User.findOne({ email });
    console.log("admin user = ", user);
    if (user) {
      const isMatch = user.email === email;
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const payload = {
        user: {
          _id: user._id,
          email: user.email,
          role: "admin",
        },
      };

      const token = jwt.sign(payload, "I'm_Batman", { expiresIn: "1h" });
      // res.cookie("token", token, {
      //   maxAge: 3600000,
      //   httpOnly: true,
      //   sameSite: "None",
      //   secure: process.env.NODE_ENV === "production",
      // });

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user,
        role: "admin",
      });
    }

    // Check if the user is a teacher
    user = await Teacher.findOne({ teacherEmail: email });
    console.log("user = ", user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.teacherPassword);
      console.log("isMatch = ", isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const payload = {
        user: {
          _id: user._id,
          email: user.teacherEmail,
          role: "teacher",
        },
      };

      const token = jwt.sign(payload, "I'm_Batman", { expiresIn: "1h" });
      // res.cookie("token", token, {
      //   maxAge: 3600000,
      //   httpOnly: true,
      //   sameSite: "None",
      //   secure: process.env.NODE_ENV === "production",
      // });
      return res.json({
        success: true,
        message: "Login successful",
        token,
        user,
        role: "teacher",
      });
    }

    // Check if the user is a student
    user = await Student.findOne({ studentEmail: email });
    console.log("user = ", user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.studentPassword);
      console.log("isMatch = ", isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const payload = {
        user: {
          _id: user._id,
          email: user.studentEmail,
          role: "student",
        },
      };

      const token = jwt.sign(payload, "I'm_Batman", { expiresIn: "1h" });
      // res.cookie("token", token, {
      //   maxAge: 3600000,
      //   httpOnly: true,
      //   sameSite: "None",
      //   secure: process.env.NODE_ENV === "production",
      // });
      return res.json({
        success: true,
        message: "Login successful",
        token,
        user,
        role: "student",
      });
    }

    // If no user found in both User and Teacher collections
    return res.status(400).json({ message: "Invalid Credentials" });
  } catch (err) {
    console.error("Error from authController", err.message);
    res.status(500).send("Server Error");
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log("id = ", id);
  const { name, email, password } = req.body;
  const uploadStoreImage = req.file ? req.file.filename : null;
  console.log("uploadStoreImage = ", uploadStoreImage);
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.name = name;
    user.email = email;
    user.image = uploadStoreImage ? uploadStoreImage : user.image;
    // user.password = password;
    await user.save();
    return res.json({
      success: true,
      message: "User updated successfully",
      user: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

export const getUserDetails = async (req, res) => {
  try {
    let user;

    if (req.user.role === "admin") {
      user = await User.findById(req.user._id).select("-password");
    } else if (req.user.role === "teacher") {
      user = await Teacher.findById(req.user._id).select("-teacherPassword");
    } else if (req.user.role === "student") {
      user = await Student.findById(req.user._id).select("-studentPassword");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default loginUser;
