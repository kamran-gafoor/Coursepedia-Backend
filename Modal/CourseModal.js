const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, lowercase: true, required: true },
    link: { type: String, lowercase: true, required: true },
    difficulty: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
  },
  { collection: "Course" }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
