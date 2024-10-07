import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log("Token from Auth Middleware = ", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token expire" });
  }

  try {
    const decoded = jwt.verify(token, "I'm_Batman");
    // console.log("Auth Middleware Decoded = ", decoded);
    req.user = {
      _id: decoded.user._id,
      email: decoded.user.email,
      role: decoded.user.role,
    };

    if (req.user.role === "admin") {
      req.userDetails = await User.findById(req.user._id).select("-password");
      // console.log("User Details :", req.userDetails);
    } else if (req.user.role === "stduent") {
      req.userDetails = await Student.findById(req.user._id).select(
        "-studentPassword"
      );
    } else if (req.user.role === "teacher") {
      req.userDetails = await Teacher.findById(req.user._id).select(
        "-teacherPassword"
      );
      // console.log("User Details :", req.userDetails);
    }

    next();
  } catch (err) {
    console.error("Error from authmiddleware", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
