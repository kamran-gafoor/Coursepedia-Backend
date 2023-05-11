const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    phone: { type: Number },
  },
  { collection: "User" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
