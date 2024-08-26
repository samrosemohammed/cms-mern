import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
});

const User = mongoose.model("admin_users", UserSchema);

export default User;
